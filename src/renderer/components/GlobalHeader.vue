<template>
  <div id="global_header">
    <el-container class="space">
      <el-aside width="65">
        <el-menu
          v-if="!hide"
          :default-active="activeRoute"
          class="el-menu-vertical account-menu"
          :collapse="true"
          :router="true"
          :background-color="themeColor"
          text-color="#909399"
          active-text-color="#ffffff"
          role="menubar"
        >
          <el-menu-item
            :index="`/${account.id}/`"
            :route="{ path: `/${account.id}/home` }"
            v-for="[account, server] in accounts"
            :key="account.id"
            role="menuitem"
          >
            <FailoverImg :src="account.avatar" class="avatar" :title="account.username + '@' + server.domain" />
            <FailoverImg :src="`${server.baseURL}/favicon.ico`" :failoverSrc="`${server.baseURL}/favicon.png`" class="instance-icon" />
            <span>{{ server.domain }}</span>
          </el-menu-item>
          <el-menu-item index="/login/form" :title="$t('global_header.add_new_account')" role="menuitem" class="add-new-account">
            <font-awesome-icon icon="plus" />
            <span>New</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <router-view :key="$route.params.id as string"></router-view>
    </el-container>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from '@/store'
import FailoverImg from '@/components/atoms/FailoverImg.vue'
import { ACTION_TYPES } from '@/store/GlobalHeader'
import { useTranslation } from 'i18next-vue'

export default defineComponent({
  components: {
    FailoverImg
  },
  name: 'global-header',
  setup() {
    const space = 'GlobalHeader'
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const { t } = useTranslation()

    const accounts = computed(() => store.state.GlobalHeader.accounts)
    const hide = computed(() => store.state.GlobalHeader.hide)
    const themeColor = computed(() => store.state.App.theme.global_header_color)
    const activeRoute = computed(() => `/${route.path.split('/')[1]}/`)

    onMounted(() => {
      initialize()
    })

    const initialize = async () => {
      await store
        .dispatch(`${space}/${ACTION_TYPES.INIT_LOAD}`)
        .then(accounts => {
          if (route.params.id === undefined) {
            router.push({ path: `/${accounts[0][0].id}/home` })
          }
        })
        .catch(_ => {
          return router.push({ path: '/login/form' })
        })
    }

    return {
      accounts,
      hide,
      themeColor,
      activeRoute,
      $t: t
    }
  },
  methods: {}
})
</script>

<style lang="scss" scoped>
.account-menu :deep(.el-menu-item) {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: 0 !important;
}

#global_header {
  .account-menu {
    height: 100%;
    padding-top: 24px;
    border: 0;

    .avatar {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      mix-blend-mode: overlay;
    }

    .instance-icon {
      width: 18px;
      height: 18px;
      mix-blend-mode: overlay;
      vertical-align: bottom;
      margin-left: -18px;
    }

    .is-active {
      .avatar {
        mix-blend-mode: normal;
      }

      .instance-icon {
        mix-blend-mode: normal;
      }
    }
  }

  .space {
    height: 100%;
  }

  .no-global-header {
    margin-left: 0;
  }

  .with-global-header {
    margin-left: 65px;
  }

  .add-new-account {
    align-items: center;
  }
}
</style>
