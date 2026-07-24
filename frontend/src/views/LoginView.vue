<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const email = ref('admin@institution.gob.ec');
const password = ref('AdminPassword123!');
const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref('');

const router = useRouter();
const authStore = useAuthStore();

const handleLogin = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Por favor ingresa tu correo y contraseña';
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  const success = await authStore.login(email.value, password.value);
  loading.value = false;

  if (success) {
    router.push({ name: 'home' });
  } else {
    errorMessage.value = 'Credenciales inválidas. Por favor verifica los datos prestablecidos.';
  }
};
</script>

<template>
  <div class="expressive-bg d-flex align-center justify-center">
    <!-- Dynamic Decorative Elements -->
    <div class="blob blob-1" />
    <div class="blob blob-2" />

    <v-container class="px-4">
      <v-row justify="center">
        <v-col cols="12" sm="10" md="6" lg="4">
          <v-card class="login-card pa-6 pa-md-8 elevation-4">
            <!-- Brand Badge -->
            <div class="d-flex justify-center mb-4">
              <v-avatar color="primaryContainer" size="64" class="elevation-1">
                <v-icon icon="mdi-bag-suitcase" color="primary" size="36" />
              </v-avatar>
            </div>

            <!-- Title & Subtitle MD3 Expressive -->
            <h1 class="text-h4 font-weight-black text-center mb-1 text-primary-container-dark">
              Viáticos Express
            </h1>
            <p class="text-body-2 text-center text-medium-emphasis mb-6">
              Módulo Institucional de Gestión de Solicitudes
            </p>

            <!-- Alert Error -->
            <v-alert
              v-if="errorMessage"
              type="error"
              variant="tonal"
              closable
              rounded="lg"
              class="mb-4"
              @click:close="errorMessage = ''"
            >
              {{ errorMessage }}
            </v-alert>

            <!-- Form -->
            <v-form @submit.prevent="handleLogin">
              <div class="text-label text-caption font-weight-bold mb-1 ml-1 text-medium-emphasis">
                CORREO INSTITUCIONAL
              </div>
              <v-text-field
                v-model="email"
                type="email"
                placeholder="ejemplo@gobierno.gob.ec"
                prepend-inner-icon="mdi-account-circle-outline"
                variant="outlined"
                color="primary"
                class="mb-3"
                hide-details="auto"
                aria-label="Correo electrónico institucional"
              />

              <div class="text-label text-caption font-weight-bold mb-1 ml-1 text-medium-emphasis">
                CONTRASEÑA
              </div>
              <v-text-field
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Ingresa tu contraseña"
                prepend-inner-icon="mdi-lock-open-outline"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                variant="outlined"
                color="primary"
                class="mb-6"
                hide-details="auto"
                aria-label="Contraseña"
                @click:append-inner="showPassword = !showPassword"
              />

              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                :loading="loading"
                class="login-btn text-none font-weight-bold text-subtitle-1 py-3"
              >
                Ingresar al Sistema
                <v-icon end icon="mdi-arrow-right" />
              </v-btn>
            </v-form>

            <v-divider class="my-6" />

            <!-- Quick Demo Credentials Helper -->
            <div class="demo-chip-container pa-3 rounded-lg bg-surface-variant">
              <div class="text-caption font-weight-bold text-center text-medium-emphasis mb-2">
                Credenciales Demo por Defecto:
              </div>
              <div class="d-flex justify-center gap-2">
                <v-chip size="small" color="primary" variant="flat" class="mr-1">
                  admin@institution.gob.ec
                </v-chip>
                <v-chip size="small" variant="outlined">
                  AdminPassword123!
                </v-chip>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.expressive-bg {
  min-height: 100vh;
  width: 100vw;
  background-color: #FEF7FF;
  position: relative;
  overflow: hidden;
}

.login-card {
  background: rgba(254, 247, 255, 0.85) !important;
  backdrop-filter: blur(16px);
  border: 1px solid rgba(103, 80, 164, 0.12);
  border-radius: 28px !important; /* MD3 Extra Large Corner */
  box-shadow: 0 20px 40px rgba(33, 0, 93, 0.08) !important;
}

.text-primary-container-dark {
  color: #21005D;
}

.login-btn {
  border-radius: 100px !important; /* MD3 Pill Button */
  background: linear-gradient(135deg, #6750A4 0%, #7D5260 100%) !important;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(103, 80, 164, 0.3) !important;
}

/* Background Blobs MD3 Expressive */
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.45;
  pointer-events: none;
}

.blob-1 {
  width: 400px;
  height: 400px;
  background: #EADDFF;
  top: -100px;
  left: -100px;
}

.blob-2 {
  width: 350px;
  height: 350px;
  background: #FFD8E4;
  bottom: -80px;
  right: -80px;
}

.demo-chip-container {
  border: 1px dashed rgba(121, 116, 126, 0.3);
}
</style>
