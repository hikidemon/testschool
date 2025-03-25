
<template>
  <div class="programs-page">
    <header class="page-header neumorphic">
      <h1 class="emerald-gradient-text">Школьные программы</h1>
      <p>Выберите образовательную программу для вашего развития</p>
    </header>
    
    <program-list />
    
    <el-dialog
      v-model="showEnrollDialog"
      title="Запись на программу"
      width="30%"
    >
      <enrollment-form
        :program-id="selectedProgramId"
        @success="handleEnrollmentSuccess"
        @cancel="showEnrollDialog = false"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProgramList from '@/components/organisms/ProgramList.vue'
import EnrollmentForm from '@/components/molecules/EnrollmentForm.vue'

const showEnrollDialog = ref(false)
const selectedProgramId = ref('')

const handleEnrollmentSuccess = () => {
  showEnrollDialog.value = false
  // Show success message
}
</script>

<style scoped>
.programs-page {
  min-height: 100vh;
  padding: 20px;
}

.page-header {
  text-align: center;
  padding: 40px 20px;
  margin-bottom: 40px;
}

.page-header h1 {
  margin-bottom: 10px;
}

.page-header p {
  color: var(--text-dark);
  opacity: 0.8;
}
</style>
