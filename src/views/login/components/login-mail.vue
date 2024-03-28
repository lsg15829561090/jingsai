<template>
  <div class="login-form-container">
    <!-- 登录表单 -->
    <tiny-form
      ref="loginFormMail"
      :model="loginMail"
      class="login-form"
      :rules="rules"
      validate-type="text"
      label-width="0"
      size="medium"
    >
      <!-- 邮箱输入 -->
      <tiny-form-item prop="mailname" size="medium">
        <tiny-input
          v-model="loginMail.mailname"
          :placeholder="$t('login.form.mailName.placeholder')"
        >
        </tiny-input>
      </tiny-form-item>

      <!-- 密码输入 -->
      <tiny-form-item prop="mailpassword" size="medium">
        <tiny-input
          v-model="loginMail.mailpassword"
          type="password"
          show-password
          :placeholder="$t('login.form.mailpassword.placeholder')"
        >
        </tiny-input>
      </tiny-form-item>

      <div class="login-form-options">
        <!-- 身份选择下拉框 -->
        <tiny-select v-model="value" ref="role" placeholder="请选择用户身份">
          <tiny-option v-for="item in options"  :key="item.value" :label="item.label" :value="item.value" :icon="item.icon">
          </tiny-option>
        </tiny-select>
        <div>
          <!-- 跳转到注册链接 -->
          <tiny-link type="primary" class="divide-line">|</tiny-link>
          <tiny-link type="primary" @click="typeChange">
            {{ $t('login.form.registration') }}
          </tiny-link>
        </div>
      </div>
      <!-- 登录按钮 -->
      <tiny-form-item size="medium">
        <tiny-button
          type="primary"
          class="login-form-btn"
          :loading="loading"
          @click="handleSubmit"
          >{{ $t('login.form.login') }}</tiny-button
        >
      </tiny-form-item>
    </tiny-form>
  </div>
</template>

<script lang="ts" setup>
  // 导入所需的库和组件
  import { inject, ref, reactive, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import {
    Form as TinyForm,
    FormItem as TinyFormItem,
    Input as TinyInput,
    Button as TinyButton,
    Checkbox as TinyCheckbox,
    Link as TinyLink,
    Select as TinySelect,
    Option as TinyOption,
    Modal,
    Notify,
  } from '@opentiny/vue';
  import { useI18n } from 'vue-i18n'; // 导入国际化插件
  import { useUserStore } from '@/store'; // 导入用户存储库
  import useLoading from '@/hooks/loading'; // 导入加载钩子
  import { IconAdministrator } from '@opentiny/vue-icon'; // 导入图标组件

  const router = useRouter();
  const { t } = useI18n();
  const { loading, setLoading } = useLoading();
  const userStore = useUserStore();
  const loginFormMail = ref();

  // 表单验证规则
  const rules = computed(() => {
    return {
      mailname: [
        {
          required: true,
          message: t('login.form.mailName.errMsg'),
          trigger: 'change',
        },
      ],
      mailpassword: [
        {
          required: true,
          message: t('login.form.mailpassword.errMsg'),
          trigger: 'change',
        },
      ],
    };
  });

  // 身份列表
  const options = ref([
    { value: '1', label: '学生', icon: IconAdministrator() },
    { value: '2', label: '教师', icon: IconAdministrator() },
    { value: '3', label: '管理员', icon: IconAdministrator() },
  ]);
  const value = ref('');

  // 表单数据
  const loginMail = reactive({
    mailname: 'admin@example.com',
    mailpassword: 'admin',
    rememberPassword: true,
  });

  // 切换模式
  const handle: any = inject('handle');
  const typeChange = () => {
    handle(true);
  };

  // 处理表单提交
  function handleSubmit() {
    loginFormMail.value?.validate(async (valid: boolean) => {
      if (!valid) {
        return;
      }
      alert(value)
      setLoading(true);
      const role = ref();
      console.log(value.value)
      if(value.value==='1'){
       // 当用户为学生时
      try {
        await userStore.login({
          username: loginMail.mailname,
          password: loginMail.mailpassword,
        });
        Modal.message({
          message: t('login.form.login.success'),
          status: 'success',
        });
        const { redirect, ...othersQuery } = router.currentRoute.value.query;
        router.push({
          name: (redirect as string) || 'Home',
          query: {
            ...othersQuery,
          },
        });
      } catch (err) {
        Notify({
          type: 'error',
          title: t('login.tip.right'),
          message: t('login.tip.mail'),
          position: 'top-right',
          duration: 2000,
          customClass: 'my-custom-cls',
        });
      } finally {
        setLoading(false);
      }
      }else if(value.value==='2'){
        // 当用户为教师时
      }else if(value.value==='3'){
        // 当用户为管理员时
      }
      
    });
  }
</script>

<style lang="less" scoped>
.tiny-select {
  width: 40%;
}
  /* 样式表 */
  .login-form-container {
    margin-top: 5%;
  }

  .login-form {
    margin-left: 6%;

    .tiny-form-item {
      margin-bottom: 20px;
    }

    &-container {
      width: 320px;
    }

    &-options {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      font-size: 12px;
    }

    &-btn {
      display: block;
      width: 100%;
      max-width: 100%;
    }
  }

  .divide-line {
    margin: 0 5px;
  }
  // responsive
  @media (max-width: @screen-ms) {
    .login-form {
      margin-left: 5%;

      &-container {
        width: 240px;
      }
    }
  }
</style>
