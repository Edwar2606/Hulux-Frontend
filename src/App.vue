<script setup>
import { ref } from 'vue'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5133'

const pantalla = ref('inicio')

const nombre = ref('')
const documento = ref('')
const contraseña = ref('')

const montoDepositar = ref('')
const montoRetirar = ref('')
const documentoDestino = ref('')
const montoTransferencia = ref('')
const nombreUsuario = ref('')

const loginDocumento = ref('')
const loginContraseña = ref('')

const saldo = ref(0)
const clientId = ref(0)

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

    <h1>Panel Bancario</h1>

    <h2>
  Bienvenido {{ nombreUsuario }}
    </h2>

    <h2>
      Saldo Actual
    </h2>

    <div class="saldo">
      $ {{ saldo }}
    </div>

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

<h2>Transferir</h2>

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

</style>