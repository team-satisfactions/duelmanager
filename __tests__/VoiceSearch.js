import Vuex from "vuex";
import { shallowMount,createLocalVue } from '@vue/test-utils'
import VoiceSearch from '@/components/VoiceSearch'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('VoiceSearch', () => {
  let actions,store;

  beforeEach(() => {
    actions = {
      initializeVoiceLog:jest.fn(),
      updateVoiceLogs   :jest.fn()
    }

    const voicelog = {
      namespaced: true,
      state: {
        voicelogs:[]
      },
      actions
    }
    store = new Vuex.Store({
      modules: { voicelog }
    })
  })

  test('Mountされる', () => {
    const wrapper = shallowMount(VoiceSearch, { store, localVue })
    expect(wrapper.find('div')).toBeTruthy()
  })
})

