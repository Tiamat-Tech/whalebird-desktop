import { Module, MutationTree, ActionTree } from 'vuex'
import { RootState } from '@/store'
import { MyWindow } from '~/src/types/global'
import { Setting, UnreadNotification, Timeline as TimelineSetting } from '~src/types/setting'
import { Base } from '~/src/constants/initializer/setting'

const win = (window as any) as MyWindow

export type TimelineState = {
  setting: TimelineSetting
}

const state = (): TimelineState => ({
  setting: Base.timeline
})

export const MUTATION_TYPES = {
  UPDATE_TIMELINE_SETTING: 'updateTimelineSetting'
}

const mutations: MutationTree<TimelineState> = {
  [MUTATION_TYPES.UPDATE_TIMELINE_SETTING]: (state, setting: TimelineSetting) => {
    state.setting = setting
  }
}

const actions: ActionTree<TimelineState, RootState> = {
  loadTimelineSetting: async ({ commit, rootState }): Promise<boolean> => {
    const setting: Setting = await win.ipcRenderer.invoke('get-account-setting', rootState.Settings.accountID)
    commit(MUTATION_TYPES.UPDATE_TIMELINE_SETTING, setting.timeline)
    return true
  },
  changeUnreadNotification: async ({ dispatch, state, rootState }, timeline: { key: boolean }): Promise<boolean> => {
    const unread: UnreadNotification = Object.assign({}, state.setting.unreadNotification, timeline)
    const tl: TimelineSetting = Object.assign({}, state.setting, {
      unreadNotification: unread
    })
    const setting: Setting = {
      accountID: rootState.Settings.accountID!,
      timeline: tl
    }
    await win.ipcRenderer.invoke('update-account-setting', setting)
    dispatch('loadTimelineSetting')
    return true
  }
}

const Timeline: Module<TimelineState, RootState> = {
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions
}

export default Timeline
