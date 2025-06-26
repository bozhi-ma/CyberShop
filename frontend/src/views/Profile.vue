<template>
  <div class="profile-edit-container">
    <h2>编辑个人资料</h2>
    <el-form :model="form" label-width="80px" class="profile-form">
      <el-form-item label="头像">
        <el-upload
          class="avatar-uploader"
          action="/api/upload/avatar"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="form.avatar" :src="form.avatar" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="昵称">
        <el-input v-model="form.nickname" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="form.phone" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveProfile">保存</el-button>
        <el-button @click="goBack">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/user';
import { ElMessage } from 'element-plus';

const userStore = useUserStore();
const router = useRouter();

const form = ref({
  avatar: userStore.userInfo.avatar,
  nickname: userStore.userInfo.nickname || userStore.userInfo.username,
  email: userStore.userInfo.email,
  phone: userStore.userInfo.phone,
});

function handleAvatarSuccess(res: any) {
  form.value.avatar = res.url;
}
function beforeAvatarUpload(file: File) {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isJPG) {
    ElMessage.error('只能上传 JPG/PNG 图片!');
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!');
  }
  return isJPG && isLt2M;
}
async function saveProfile() {
  // TODO: 实现 userStore.updateProfile 方法，提交 form.value 到后端并更新 userStore.userInfo
  // await userStore.updateProfile(form.value);
  ElMessage.info('请实现 updateProfile 方法以保存资料');
  router.push('/user-center');
}
function goBack() {
  router.back();
}
</script>

<style scoped>
.profile-edit-container {
  max-width: 420px;
  margin: 60px auto 0 auto;
  background: #232334;
  border-radius: 18px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.08);
  padding: 36px 32px 32px 32px;
  color: #fff;
}
.profile-form {
  margin-top: 24px;
}
.avatar-uploader {
  display: flex;
  align-items: center;
}
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  background: #444;
}
.avatar-uploader-icon {
  font-size: 32px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 50%;
  background: #292940;
}
</style> 