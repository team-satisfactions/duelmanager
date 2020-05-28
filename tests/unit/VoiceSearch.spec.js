import { shallowMount,createLocalVue } from '@vue/test-utils'
import flushPromises from 'flush-promises'

import Vuex from "vuex";
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

  test('unitテストでは音声認識ができないためnotSupportになる',async () => {
    const wrapper = shallowMount(VoiceSearch, { store, localVue })

    expect(wrapper.vm.$data.isRecognition).toBe(false)
    expect(wrapper.vm.$data.notSupport).toBe(false)

    expect(wrapper.find('button').exists()).toBe(true)
    wrapper.find('button').trigger('click')
    await flushPromises()

    expect(wrapper.vm.$data.isRecognition).toBe(true)
    expect(wrapper.vm.$data.notSupport).toBe(true)
    expect(wrapper.text()).toMatch('音声の受信のみ(サポートされていないブラウザです)');
  })

  test('vuexのStoreにテキストが追加された場合画面に表示される',async () => {
    const wrapper = shallowMount(VoiceSearch, { store, localVue })

    wrapper.find('button').trigger('click')
    await flushPromises()

    expect(wrapper.find('.voice-text').exists()).toBe(false)
    expect(wrapper.findAll('.voice-text > a').length).toBe(0)

    expect(store.state.voicelog.voicelogs).toEqual([])

    store.state.voicelog.voicelogs = [
      {
        time: 1000000,
        text: '青眼の白竜を召喚'
      },{
        time: 1000001,
        text: 'ブラック・マジシャンを召喚'
      },
    ]
    await flushPromises()

    expect(wrapper.find('.voice-text').exists()).toBe(true)
    expect(wrapper.findAll('.voice-text > a').length).toBe(2)

    expect(wrapper.findAll('.voice-text > a').at(0).text())
      .toBe('青眼の白竜を召喚')

  })
})

