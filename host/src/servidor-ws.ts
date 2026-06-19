import { WebSocketServer, WebSocket } from 'ws';
import type { EstadoJuego } from './tipos.ts';
import { CONFIGS_JUGADORES, MAX_JUGADORES, crearEstadoInicial } from './tipos';
import { crearMotorFisico, crearCuerpoJugador, aplicarMovimiento, estaEnSuelo, MotorFisico } from './motor';
import { NIVELES } from './niveles';
import Matter from 'matter-js';

type TipoInput = 'izquierda' | 'derecha' | 'salto' | 'ninguna';

interface MensajeInput {
  tipo: 'input';
  direccion: TipoInput;
  estado: 'presionado' | 'soltado';
}

const inputsActivos = new Map<string, Set<TipoInput>>();

export function iniciarServidorWS(puerto: number) {
  const wss = new WebSocketServer({ port: puerto });
  const estado: EstadoJuego = crearEstadoInicial();
  let motorActual = crearMotorFisico(NIVELES[0]);

  //console.log(`Servidor WebSocket corriendo en puerto ${puerto}`);

  setInterval(() => {
    if (estado.fase === 'jugando') {
    procesarInputs(estado, motorActual.motor);
    Matter.Engine.update(motorActual.motor, 1000 / 30); 
    verificarColisiones(estado, motorActual);
  }

   if (estado.fase === 'nivel-completado') {
    if (estado.nivelActual < NIVELES.length) {
      estado.nivelActual++;
      motorActual.destruir();
      motorActual = crearMotorFisico(NIVELES[estado.nivelActual - 1]);
      
      // reposicionar jugadores en el nuevo nivel
      for (const [i, jugador] of [...estado.jugadores.values()].filter(j => j.conectado).entries()) {
        const pos = NIVELES[estado.nivelActual - 1].posicionesIniciales[i];
        Matter.Body.setPosition(jugador.cuerpofisico, pos);
        Matter.Body.setVelocity(jugador.cuerpofisico, { x: 0, y: 0 });
        Matter.World.add(motorActual.mundo, jugador.cuerpofisico);
        jugador.cargandoLlave = false;
      }

      estado.llaveRecogida = false;
      estado.llaveEnJuego  = true;
      estado.fase          = 'jugando';
      broadcast(wss, { tipo: 'juego-inicio', nivel: estado.nivelActual });
    }
  }


  enviarEstadoATodos(wss, estado, motorActual); 
}, 1000 / 30);


  wss.on('connection', (socket: WebSocket) => {
  const idSocket = generarId();

  socket.once('message', (datos: Buffer) => {
    try {
      const mensaje = JSON.parse(datos.toString());
      if (mensaje.tipo !== 'identificacion' || mensaje.rol !== 'jugador') return;

      const jugadoresConectados = [...estado.jugadores.values()].filter(j => j.conectado);
      if (jugadoresConectados.length >= MAX_JUGADORES) {
        socket.send(JSON.stringify({ tipo: 'error', mensaje: 'Juego lleno (máximo 4 jugadores)' }));
        socket.close();
        return;
      }

const indice = [...estado.jugadores.values()].filter(j => j.conectado).length % CONFIGS_JUGADORES.length;
      const config  = CONFIGS_JUGADORES[indice];
      const nivel   = NIVELES[estado.nivelActual - 1];
      const posInicial = nivel.posicionesIniciales[indice];
      const cuerpo  = crearCuerpoJugador(posInicial.x, posInicial.y, idSocket);
      Matter.World.add(motorActual.mundo, cuerpo);

      estado.jugadores.set(idSocket, {
        id:            idSocket,
        nombre:        config.nombre,
        color:         config.color,
        cuerpofisico:  cuerpo,
        cargandoLlave: false,
        conectado:     true,
      });

      inputsActivos.set(idSocket, new Set());
      console.log(`✅ ${config.nombre} conectado (ID: ${idSocket})`);

      socket.send(JSON.stringify({ tipo: 'bienvenida', id: idSocket, nombre: config.nombre, color: config.color }));

      if ([...estado.jugadores.values()].filter(j => j.conectado).length >= 1) {
        estado.fase = 'jugando';
        broadcast(wss, { tipo: 'juego-inicio', nivel: estado.nivelActual });
      } else {
        broadcast(wss, {
          tipo: 'lobby-actualizado',
          jugadoresConectados: contarJugadores(estado),
          esperando: MAX_JUGADORES - contarJugadores(estado),
        });
      }

      socket.on('message', (datos: Buffer) => {
        try {
          const msg: MensajeInput = JSON.parse(datos.toString());
          console.log('Input recibido:', msg); // agregá esto para ver los inputs que llegan
          if (msg.tipo !== 'input') return;
          const inputs = inputsActivos.get(idSocket);
          if (!inputs) return;
          if (msg.estado === 'presionado') inputs.add(msg.direccion);
          else inputs.delete(msg.direccion);
        } catch {}
      });

      socket.on('close', () => {
        const jugador = estado.jugadores.get(idSocket);
        if (jugador) {
          jugador.conectado = false;
          Matter.World.remove(motorActual.mundo, jugador.cuerpofisico);
          if (jugador.cargandoLlave) {
            jugador.cargandoLlave = false;
            estado.llaveEnJuego   = true;
            estado.llaveRecogida  = false;
          }
          console.log(`❌ ${jugador.nombre} desconectado`);
          broadcast(wss, { tipo: 'jugador-desconectado', id: idSocket, nombre: jugador.nombre });
        }
        inputsActivos.delete(idSocket);
      });

     } catch {}
  });
});

} 

function procesarInputs(estado: EstadoJuego, motor: Matter.Engine): void {
  for (const [id, jugador] of estado.jugadores) {
    if (!jugador.conectado) continue;
    const inputs  = inputsActivos.get(id) ?? new Set();
    const enSuelo = estaEnSuelo(jugador.cuerpofisico, motor);

    // movimiento horizontal independiente del salto
    if (inputs.has('izquierda')) {
      aplicarMovimiento(jugador.cuerpofisico, 'izquierda', enSuelo);
    } else if (inputs.has('derecha')) {
      aplicarMovimiento(jugador.cuerpofisico, 'derecha', enSuelo);
    } else {
      aplicarMovimiento(jugador.cuerpofisico, 'ninguna', enSuelo);
    }

    // salto independiente del movimiento horizontal
    if (inputs.has('salto')) {
      aplicarMovimiento(jugador.cuerpofisico, 'salto', enSuelo);
    }
  }
}
function verificarColisiones(estado: EstadoJuego, motor: MotorFisico): void {
  for (const jugador of estado.jugadores.values()) {
    if (!jugador.conectado) continue;
    const pos = jugador.cuerpofisico.position;

    if (estado.llaveEnJuego && !estado.llaveRecogida && motor.cuerpoLlave) {
      const posLlave  = motor.cuerpoLlave.position;
      const distancia = Math.hypot(pos.x - posLlave.x, pos.y - posLlave.y);
      if (distancia < 40) {
        jugador.cargandoLlave = true;
        estado.llaveRecogida  = true;
        estado.llaveEnJuego   = false;
        Matter.World.remove(motor.mundo, motor.cuerpoLlave!);
      }
    }

    const nivel = NIVELES[estado.nivelActual - 1];
    if (jugador.cargandoLlave && pos.y > nivel.altoMundo + 50) {
      jugador.cargandoLlave = false;
      estado.llaveRecogida  = false;
      estado.llaveEnJuego   = true;
    const llaveNueva = Matter.Bodies.circle(
    nivel.posicionLlave.x,
    nivel.posicionLlave.y,
    15,
    { label: 'llave', isStatic: true, collisionFilter: { mask: 0x0002 } }
  );
  Matter.World.add(motor.mundo, llaveNueva);
  motor.cuerpoLlave = llaveNueva;
}

  if (estado.llaveRecogida) {
    verificarCondicionVictoria(estado, motor);
  }
}
}

function verificarCondicionVictoria(estado: EstadoJuego, motor: MotorFisico): void {
  const puerta = motor.cuerposPuerta[0];
  if (!puerta) return;

  const jugadoresConectados = [...estado.jugadores.values()].filter(j => j.conectado);
  
  if (jugadoresConectados.length < 1) return; //temporalmente, solo para probar el nivel 2

  const todosEnPuerta = [...estado.jugadores.values()]
    .filter(j => j.conectado)
    .every(j => Matter.Bounds.contains(puerta.bounds, j.cuerpofisico.position));

  if (todosEnPuerta) {
    estado.fase = 'nivel-completado';
  }
}

function enviarEstadoATodos(wss: WebSocketServer, estado: EstadoJuego, motor: MotorFisico): void {
  const cajas = Matter.Composite.allBodies(motor.motor.world)
    .filter(b => b.label === 'caja')
    .map(b => ({ x: b.position.x, y: b.position.y }));
  const snapshot = {
    tipo:      'estado',
    fase:      estado.fase,
    jugadores: [...estado.jugadores.values()].map(j => ({
      id:            j.id,
      nombre:        j.nombre,
      color:         j.color,
      x:             j.cuerpofisico.position.x,
      y:             j.cuerpofisico.position.y,
      cargandoLlave: j.cargandoLlave,
      conectado:     j.conectado,
    })),
    llaveEnJuego:  estado.llaveEnJuego,
    llaveRecogida: estado.llaveRecogida,
    cajas,
  };
  broadcast(wss, snapshot);
}

function broadcast(wss: WebSocketServer, datos: object): void {
  const mensaje = JSON.stringify(datos);
  wss.clients.forEach((cliente) => {
    if (cliente.readyState === WebSocket.OPEN) {
      cliente.send(mensaje);
    }
  });
}

function contarJugadores(estado: EstadoJuego): number {
  return [...estado.jugadores.values()].filter(j => j.conectado).length;
}

function generarId(): string {
  return Math.random().toString(36).slice(2, 9);
}