<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
  router.push({ name: 'login' });
};
</script>

<template>
  <v-app class="bg-background">
    <!-- MD3 Expressive Navigation Bar -->
    <v-app-bar flat color="surface" class="px-md-4 border-b">
      <v-avatar color="primaryContainer" size="40" class="mr-3">
        <v-icon icon="mdi-bag-suitcase" color="primary" />
      </v-avatar>
      <v-app-bar-title class="font-weight-black text-h6 text-primary-container-dark">
        Viáticos Express
      </v-app-bar-title>

      <v-spacer />

      <!-- User Role Chip MD3 -->
      <v-chip color="secondaryContainer" variant="flat" size="large" class="mr-3 font-weight-medium">
        <v-icon start icon="mdi-account-circle" color="on-secondary-container" />
        {{ authStore.user?.email }}
        <v-badge color="tertiary" :content="authStore.userRole?.toUpperCase()" inline class="ml-2" />
      </v-chip>

      <v-btn
        variant="tonal"
        color="error"
        rounded="pill"
        prepend-icon="mdi-logout"
        aria-label="Cerrar Sesión"
        @click="handleLogout"
      >
        Salir
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container class="py-8">
        <!-- Hero Expressive Card -->
        <v-card class="pa-6 pa-md-8 mb-8 hero-card elevation-2">
          <v-row align="center">
            <v-col cols="12" md="8">
              <v-chip color="tertiaryContainer" variant="flat" size="small" class="mb-3 font-weight-bold">
                PANEL DE CONTROL MD3
              </v-chip>
              <h2 class="text-h3 font-weight-black mb-2 text-primary-container-dark">
                Bienvenido al Sistema
              </h2>
              <p class="text-subtitle-1 text-medium-emphasis">
                Plataforma de autogestión y procesamiento de viáticos institucionales. Rol activo: <strong>{{ authStore.userRole }}</strong>.
              </p>
            </v-col>
            <v-col cols="12" md="4" class="text-right d-none d-md-block">
              <v-icon icon="mdi-shield-check-outline" size="120" color="primaryContainer" />
            </v-col>
          </v-row>
        </v-card>

        <!-- Quick Access Feature Grid -->
        <h3 class="text-h5 font-weight-bold mb-4">Módulos del Sistema</h3>
        <v-row>
          <v-col cols="12" md="4">
            <v-card class="pa-6 module-card text-center h-100" variant="outlined">
              <v-avatar color="primaryContainer" size="64" class="mb-4">
                <v-icon icon="mdi-file-document-plus-outline" size="32" color="primary" />
              </v-avatar>
              <div class="text-h6 font-weight-bold mb-1">Mis Solicitudes</div>
              <div class="text-body-2 text-medium-emphasis mb-4">
                Crea y edita tus borradores de solicitud de viáticos.
              </div>
              <v-btn color="primary" variant="tonal" rounded="pill" block>
                Gestionar
              </v-btn>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card class="pa-6 module-card text-center h-100" variant="outlined">
              <v-avatar color="secondaryContainer" size="64" class="mb-4">
                <v-icon icon="mdi-clipboard-check-outline" size="32" color="secondary" />
              </v-avatar>
              <div class="text-h6 font-weight-bold mb-1">Aprobaciones</div>
              <div class="text-body-2 text-medium-emphasis mb-4">
                Revisa y aprueba solicitudes enviadas por el personal.
              </div>
              <v-btn color="secondary" variant="tonal" rounded="pill" block>
                Revisar
              </v-btn>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card class="pa-6 module-card text-center h-100" variant="outlined">
              <v-avatar color="tertiaryContainer" size="64" class="mb-4">
                <v-icon icon="mdi-text-box-search-outline" size="32" color="tertiary" />
              </v-avatar>
              <div class="text-h6 font-weight-bold mb-1">Bitácora de Auditoría</div>
              <div class="text-body-2 text-medium-emphasis mb-4">
                Consulta los eventos registrados en el sistema.
              </div>
              <v-btn color="tertiary" variant="tonal" rounded="pill" block>
                Ver Logs
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.text-primary-container-dark {
  color: #21005D;
}

.hero-card {
  background: linear-gradient(135deg, #FEF7FF 0%, #EADDFF 100%) !important;
  border-radius: 28px !important;
  border: 1px solid rgba(103, 80, 164, 0.15);
}

.module-card {
  border-radius: 24px !important;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  background: #FFFFFF !important;
}

.module-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(33, 0, 93, 0.08) !important;
}
</style>
