<script setup>
import { ref } from 'vue'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5133'

const nombre = ref('')
const documento = ref('')
const contraseña = ref('')

const montoDepositar = ref('')
const montoRetirar = ref('')
const documentoDestino = ref('')
const montoTransferencia = ref('')
const nombreUsuario = ref('')
const pantalla = ref('inicio')
const movimientos = ref([])

const loginDocumento = ref('')
const loginContraseña = ref('')

const saldo = ref(0)
const clientId = ref(0)

const formatoPesos = (valor) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor)
}

const registrarCliente = async () => {
  const respuesta = await fetch(`${API_URL}/clients`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      Nombre_Cliente: nombre.value,
      Documento: documento.value,
      Contraseña: contraseña.value
    })
  })

  const resultado = await respuesta.text()
  alert(resultado)
}

const iniciarSesion = async () => {
  const respuesta = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      Documento: loginDocumento.value,
      Contraseña: loginContraseña.value
    })
  })

  if (!respuesta.ok) {
    alert('Datos incorrectos')
    return
  }

  const datos = await respuesta.json()

  clientId.value = datos.clientId
  nombreUsuario.value = datos.nombre
  saldo.value = datos.saldo

  pantalla.value = 'panel'

  await cargarMovimientos()
}

const depositar = async () => {
  const respuesta = await fetch(`${API_URL}/deposito`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ClienteOrigen: clientId.value,
      Monto: Number(montoDepositar.value)
    })
  })

  const datos = await respuesta.json()
  saldo.value = datos.saldo
  alert(datos.mensaje)
  pantalla.value = 'panel'

  await cargarMovimientos()
  montoDepositar.value = ''
}

const retirar = async () => {
  const respuesta = await fetch(`${API_URL}/retiro`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ClienteOrigen: clientId.value,
      Monto: Number(montoRetirar.value)
    })
  })

  const datos = await respuesta.json()
  saldo.value = datos.saldo
  alert(datos.mensaje)
  pantalla.value = 'panel'

  await cargarMovimientos()
  montoRetirar.value = ''
}

const transferir = async () => {
  const respuesta = await fetch(`${API_URL}/transferencia`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ClienteOrigen: clientId.value,
      DocumentoDestino: documentoDestino.value,
      Monto: Number(montoTransferencia.value)
    })
  })

  const datos = await respuesta.json()
  saldo.value = datos.saldo
  alert(datos.mensaje)
  pantalla.value = 'panel'

  await cargarMovimientos()
  documentoDestino.value = ''
  montoTransferencia.value = ''
}

const cargarMovimientos = async () => {

  const respuesta = await fetch(
    `${API_URL}/transacciones/${clientId.value}`
  )

  if (!respuesta.ok) return

  movimientos.value = await respuesta.json()

  console.log(movimientos.value)
}

</script>

<template>

  <!-- PANTALLA BIENVENIDA --->

  <div v-if="pantalla === 'inicio'" class="contenedor">

    <h1 class="titulo">
      HULUX BANK
    </h1>

    <button
      class="boton"
      @click="pantalla = 'acceso'"
    >
      Entrar
    </button>

  </div>

  <!-- PANTALLA ACCESO -->

  <div v-if="pantalla === 'acceso'" class="contenedor">

    <h1 class="titulo2">
      HULUX BANK
    </h1>

    <button
      class="boton"
      @click="pantalla = 'registro'"
    >
      Registrarse
    </button>

    <button
      class="boton"
      @click="pantalla = 'login'"
    >
      Iniciar Sesión
    </button>

  </div>

  <!-- REGISTRO -->

  <div
    v-if="pantalla === 'registro'"
    class="contenedor"
  >

    <h2>Registro</h2>

    <input
      v-model="nombre"
      placeholder="Nombre"
    >

    <input
      v-model="documento"
      placeholder="Documento"
    >

    <input
      type="password"
      v-model="contraseña"
      placeholder="Contraseña"
    >

    <button
      class="boton"
      @click="registrarCliente"
    >
      Registrarse
    </button>

    <button
      class="boton-secundario"
      @click="pantalla = 'acceso'"
    >
      Volver
    </button>

  </div>

  <!-- LOGIN -->

  <div
    v-if="pantalla === 'login'"
    class="contenedor"
  >

    <h2>Iniciar Sesión</h2>

    <input
      v-model="loginDocumento"
      placeholder="Documento"
    >

    <input
      type="password"
      v-model="loginContraseña"
      placeholder="Contraseña"
    >

    <button
      class="boton"
      @click="iniciarSesion"
    >
      Entrar
    </button>

    <button
      class="boton-secundario"
      @click="pantalla = 'acceso'"
    >
      Volver
    </button>

  </div>

  <!-- PANEL BANCARIO -->

<div
  v-if="pantalla === 'panel'"
  class="contenedor"
>
  <h1>Hulux Bank</h1>

  <h2>
    Hola, {{ nombreUsuario }}
  </h2>

  <p style="color:white">
  Cliente ID: {{ clientId }}
  </p>

  <div class="saldo">
    {{ formatoPesos(saldo) }}
  </div>

  <div class="movimientos">

  <h2>
    Últimos movimientos
  </h2>

  <div
    v-for="(movimiento,index) in movimientos"
    :key="index"
    class="movimiento"
  >

    <strong>
      {{ movimiento.tipo }}
    </strong>

    <br>

    {{ formatoPesos(movimiento.monto) }}

    <br>

    {{ movimiento.descripcion }}

  </div>

</div>

  <button
    class="boton"
    @click="pantalla='deposito'"
  >
    Depositar
  </button>

  <button
    class="boton"
    @click="pantalla='retiro'"
  >
    Retirar
  </button>

  <button
    class="boton"
    @click="pantalla='transferencia'"
  >
    Transferir
  </button>
</div>

<div
  v-if="pantalla === 'deposito'"
  class="contenedor"
>
  <div class="panel-operacion">

    <div class="lado-saldo">
      <h2>Saldo Actual</h2>
      <div class="saldo">
        {{ formatoPesos(saldo) }}
      </div>
    </div>

    <div class="lado-accion">
      <h2>Depositar</h2>

      <input
        v-model="montoDepositar"
        type="number"
        placeholder="Monto a depositar"
      />

      <button
        class="boton"
        @click="depositar"
      >
        Depositar
      </button>

      <button
        class="btn-volver"
        @click="pantalla='panel'"
      >
        Volver al Panel
      </button>
    </div>

  </div>
</div>

<div
  v-if="pantalla === 'retiro'"
  class="contenedor"
>
  <div class="panel-operacion">

    <div class="lado-saldo">
      <h2>Saldo Actual</h2>
      <div class="saldo">
        {{ formatoPesos(saldo) }}
      </div>
    </div>

    <div class="lado-accion">
      <h2>Retirar</h2>

      <input
        v-model="montoRetirar"
        type="number"
        placeholder="Monto a retirar"
      />

      <button
        class="boton"
        @click="retirar"
      >
        Retirar
      </button>

      <button
        class="btn-volver"
        @click="pantalla='panel'"
      >
        Volver al Panel
      </button>
    </div>

  </div>
</div>

<div
  v-if="pantalla === 'transferencia'"
  class="contenedor"
>
  <div class="panel-operacion">

    <div class="lado-saldo">
      <h2>Saldo Actual</h2>
      <div class="saldo">
        {{ formatoPesos(saldo) }}
      </div>
    </div>

    <div class="lado-accion">
      <h2>Transferencia</h2>

      <input
        v-model="documentoDestino"
        placeholder="Documento destino"
      />

      <input
        v-model="montoTransferencia"
        type="number"
        placeholder="Monto a transferir"
      />

      <button
        class="boton"
        @click="transferir"
      >
        Transferir
      </button>

      <button
        class="btn-volver"
        @click="pantalla='panel'"
      >
        Volver al Panel
      </button>
    </div>

  </div>
</div>

</template>

<style scoped>

.contenedor{
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  min-height:100vh;
  background:#111;
  gap:20px;
}

.titulo{
  color:#a020f0;
  font-size:70px;
}

.titulo2{
  color:#a020f0;
  font-size:50px;
}

.boton{
  width:260px;
  padding:15px;
  font-size:18px;
  border:none;
  border-radius:10px;
  background:#a020f0;
  color:white;
  cursor:pointer;
}

.boton-secundario{
  width:260px;
  padding:15px;
}

input{
  width:300px;
  padding:12px;
  font-size:16px;
  border-radius:8px;
}

.saldo{
  color:#00ff88;
  font-size:40px;
  font-weight:bold;
}

h1,h2{
  color:white;
}

.panel-operacion{
  display:flex;
  width:100%;
  max-width:1000px;
  gap:40px;
}

.lado-saldo{
  flex:1;
  background:#1a1a1a;
  padding:30px;
  border-radius:15px;
  text-align:center;
}

.lado-accion{
  flex:1;
  background:#222;
  padding:30px;
  border-radius:15px;
  display:flex;
  flex-direction:column;
  gap:15px;
  align-items:center;
}

.btn-volver{
  background:#000000;
  color:white;
  border:none;
  padding:12px;
  border-radius:10px;
  cursor:pointer;
}

.btn-volver:hover{
  background:#777;
}

.movimientos{
  width:500px;
  max-height:300px;
  overflow-y:auto;
  background:#1a1a1a;
  border-radius:15px;
  padding:20px;
}

.movimiento{
  background:#222;
  color:white;
  padding:12px;
  margin-bottom:10px;
  border-radius:10px;
}

</style>