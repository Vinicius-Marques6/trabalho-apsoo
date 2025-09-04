<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface WeatherForecast {
  date: string
  temperatureC: number
  temperatureF: number
  summary: string
}

const forecasts = ref<WeatherForecast[]>([])

onMounted(async () => {
  try {
    const response = await fetch('/api/WeatherForecast')
    if (response.ok) {
      forecasts.value = await response.json()
    }
  } catch (error) {
    console.error('Erro ao buscar previsões do tempo:', error)
  }
})
</script>

<template>
  <div>
    <p class="title">Previsão do Tempo</p>
    <table v-if="forecasts.length">
      <thead>
        <tr>
          <th>Data</th>
          <th>Temp. (°C)</th>
          <th>Temp. (°F)</th>
          <th>Resumo</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="forecast in forecasts" :key="forecast.date">
          <td>{{ forecast.date }}</td>
          <td>{{ forecast.temperatureC }}</td>
          <td>{{ forecast.temperatureF }}</td>
          <td>{{ forecast.summary }}</td>
        </tr>
      </tbody>
    </table>
    <div v-else>Carregando...</div>
  </div>
</template>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}
th,
td {
  border: 1px solid #424853;
  padding: 8px;
  text-align: left;
}

.title {
  text-align: center;
  margin-top: 4px;
}
</style>
