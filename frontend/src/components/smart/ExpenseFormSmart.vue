<script setup lang="ts">
import BaseButton from './dumb/BaseButton.vue';

const handleButtonClick = () => {
  console.log('Button clicked in smart component');
};
</script>

<template>
  <v-card class="pa-4" elevation="2">
    <v-card-title>Ejemplo de Componente Smart</v-card-title>
    <v-card-text>
      Este componente Smart orquesta lógica de negocio y renderiza componentes Dumb reutilizables.
    </v-card-text>
    <v-card-actions>
      <BaseButton
        label="Guardar Cambios"
        color="primary"
        aria-label="Guardar los cambios del formulario de viáticos"
        @click="handleButtonClick"
      />
    </v-card-actions>
  </v-card>
</template>
