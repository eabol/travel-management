<script setup lang="ts">
export interface BaseButtonProps {
  label: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'elevated' | 'flat' | 'tonal' | 'outlined' | 'text' | 'plain';
  color?: string;
  disabled?: boolean;
  loading?: boolean;
  ariaLabel?: string;
}

const props = withDefaults(defineProps<BaseButtonProps>(), {
  type: 'button',
  variant: 'elevated',
  color: 'primary',
  disabled: false,
  loading: false,
  ariaLabel: undefined
});

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
};
</script>

<template>
  <v-btn
    :type="type"
    :variant="variant"
    :color="color"
    :disabled="disabled"
    :loading="loading"
    :aria-label="ariaLabel || label"
    role="button"
    class="base-button"
    @click="handleClick"
  >
    {{ label }}
  </v-btn>
</template>

<style scoped>
.base-button {
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0.015em;
}
</style>
