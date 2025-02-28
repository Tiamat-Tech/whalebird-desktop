import { createStore, Store } from 'vuex'
import { ipcMain, ipcRenderer } from '~/spec/mock/electron'
import App from '@/store/App'
import DisplayStyle from '~/src/constants/displayStyle'
import { LightTheme, DarkTheme } from '~/src/constants/themeColor'
import Theme from '~/src/constants/theme'
import TimeFormat from '~/src/constants/timeFormat'
import Language from '~/src/constants/language'
import DefaultFonts from '@/utils/fonts'
import { MyWindow } from '~/src/types/global'
import { RootState } from '@/store'
;(window as any as MyWindow).ipcRenderer = ipcRenderer

const state = () => {
  return {
    theme: LightTheme,
    fontSize: 14,
    displayNameStyle: DisplayStyle.DisplayNameAndUsername.value,
    notify: {
      reply: true,
      reblog: true,
      favourite: true,
      follow: true
    },
    timeFormat: TimeFormat.Absolute.value,
    language: Language.en.key,
    defaultFonts: DefaultFonts,
    ignoreCW: false,
    ignoreNSFW: false,
    hideAllAttachments: false
  }
}

const initStore = () => {
  return {
    namespaced: true,
    state: state(),
    actions: App.actions,
    mutations: App.mutations
  }
}

describe('App', () => {
  let store: Store<RootState>

  beforeEach(() => {
    store = createStore({
      modules: {
        App: initStore()
      }
    })
  })

  describe('loadPreferences', () => {
    describe('error', () => {
      it('should not change', async () => {
        ipcMain.handle('get-preferences', async () => {
          throw new Error()
        })
        await store.dispatch('App/loadPreferences').catch(err => {
          expect(err instanceof Error).toEqual(true)
          expect(store.state.App.theme).toEqual(LightTheme)
        })
        ipcMain.removeHandler('get-preferences')
      })
    })
    describe('success', () => {
      it('should be changed', async () => {
        ipcMain.handle('get-preferences', () => {
          return {
            general: {
              timeline: {
                cw: true,
                nsfw: true
              }
            },
            language: {
              language: Language.en.key
            },
            notification: {
              notify: {
                reply: true,
                reblog: true,
                favourite: true,
                follow: true
              }
            },
            appearance: {
              theme: Theme.Dark.key,
              fontSize: 13,
              displayNameStyle: DisplayStyle.DisplayNameAndUsername.value,
              timeFormat: TimeFormat.Absolute.value,
              customThemeColor: LightTheme,
              font: DefaultFonts[0]
            }
          }
        })
        await store.dispatch('App/loadPreferences')
        expect(store.state.App.fontSize).toEqual(13)
        expect(store.state.App.theme).toEqual(DarkTheme)
        expect(store.state.App.ignoreCW).toEqual(true)
        expect(store.state.App.ignoreNSFW).toEqual(true)
        ipcMain.removeHandler('get-preferences')
      })
    })
  })
})
