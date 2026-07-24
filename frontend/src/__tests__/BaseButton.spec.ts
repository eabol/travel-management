import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import BaseButton from '../components/dumb/BaseButton.vue';

const vuetify = createVuetify({ components, directives });

describe('BaseButton.vue (Dumb Component)', () => {
  it('should render label text and set correct aria-label attribute (Black Box)', () => {
    // Arrange
    const label = 'Enviar Solicitud';
    const ariaLabel = 'Enviar la solicitud de viáticos para aprobación';

    // Act
    const wrapper = mount(BaseButton, {
      global: {
        plugins: [vuetify]
      },
      props: {
        label,
        ariaLabel
      }
    });

    // Assert
    expect(wrapper.text()).toContain(label);
    expect(wrapper.attributes('aria-label')).toBe(ariaLabel);
  });

  it('should emit click event when clicked and not disabled', async () => {
    // Arrange
    const wrapper = mount(BaseButton, {
      global: {
        plugins: [vuetify]
      },
      props: {
        label: 'Aprobar'
      }
    });

    // Act
    await wrapper.find('.v-btn').trigger('click');

    // Assert
    expect(wrapper.emitted('click')).toBeTruthy();
    expect(wrapper.emitted('click')?.length).toBe(1);
  });

  it('should not emit click event when disabled', async () => {
    // Arrange
    const wrapper = mount(BaseButton, {
      global: {
        plugins: [vuetify]
      },
      props: {
        label: 'Rechazar',
        disabled: true
      }
    });

    // Act
    await wrapper.find('.v-btn').trigger('click');

    // Assert
    expect(wrapper.emitted('click')).toBeFalsy();
  });
});
