<template>
  <div class="students-page">
    <h1 class="page-title">Наши ученики</h1>
    <div class="controls">
      <a-input v-model="search" placeholder="Поиск учеников" class="search-input" />
      <div class="action-buttons">
        <el-button @click="undo" v-if="isAdmin" :disabled="!canUndo" class="modern-butst">
          <el-icon class="arrows">
            <arrow-left />
          </el-icon>
        </el-button>
        <el-button @click="redo" v-if="isAdmin" :disabled="!canRedo" class="modern-butst">
          <el-icon class="arrows">
            <arrow-right />
          </el-icon>
        </el-button>
        <el-button type="primary" @click="saveChanges" v-if="isAdmin" class="modern-button">
          <el-icon>
            <check />
          </el-icon>
          Сохранить
        </el-button>
        <el-button @click="cancelChanges" type="primary" v-if="isAdmin" class="modern-button">
          <el-icon>
            <close />
          </el-icon>
          Отмена изменений
        </el-button>
        <el-button type="success" @click="openExportDialog" class="modern-button">
          <el-icon>
            <download />
          </el-icon>
          Экспорт в Excel
        </el-button>
      </div>
    </div>
    <div class="table-container">
      <el-table :data="filteredStudents" stripe class="students-table">
        <el-table-column type="index" label="№" width="80" sortable />
        <el-table-column label="Аватар" width="120">
          <template #default="scope">
            <el-avatar :src="scope.row.avatarUrl" :size="50" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="ФИО" sortable />
        <el-table-column label="VK" width="120">
          <template #default="scope">
            <el-link :href="scope.row.vkLink" target="_blank">
              <el-icon>
                <link />
              </el-icon>
              Профиль
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label="Действия" align="right" v-if="isAdmin">
          <template #default="scope">
            <el-button size="default" class="edit-btn" @click="openEditDialog(scope.row)">
              <el-icon>
                <edit />
              </el-icon>
            </el-button>
            <el-button size="default" type="danger" class="delete-btn" @click="confirmDelete(scope.row.id)">
              <el-icon>
                <delete />
              </el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-button type="primary" @click="openAddDialog" v-if="isAdmin" class="add-student-btn">Добавить ученика</el-button>

    <student-form v-model="dialogVisible" :student="currentStudent" :dialogTitle="dialogTitle" @save="saveStudent" />

    <el-dialog v-model="exportDialogVisible" title="Экспорт данных" width="30%">
      <el-form :model="exportSettings" label-width="120px">
        <el-form-item label="Выберите поля">
          <el-checkbox-group v-model="exportSettings.selectedFields">
            <el-checkbox class="checkbox" label="name">ФИО</el-checkbox>
            <el-checkbox label="bio">Биография</el-checkbox>
            <el-checkbox label="email">Email</el-checkbox>
            <el-checkbox label="phone">Телефон</el-checkbox>
            <el-checkbox label="address">Адрес</el-checkbox>
            <el-checkbox label="birthdate">Дата рождения</el-checkbox>
            <el-checkbox label="occupation">Профессия</el-checkbox>
            <el-checkbox label="vkLink">Ссылка на VK</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="exportDialogVisible = false">Отменить</el-button>
        <el-button type="primary" @click="exportToExcel">Экспорт</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { userService } from '@/common/utils/UserService'
import { User } from '@/common/types/User'
import { authService } from '@/common/utils/AuthService'
import { ElMessage, ElNotification } from 'element-plus'
import { Check, Close, Edit, Delete, ArrowLeft, ArrowRight, Link, Download } from '@element-plus/icons-vue'
import StudentForm from '@/components/molecules/StudentForm.vue'
import * as XLSX from 'xlsx'

const search = ref('')
const students = ref<User[]>([])
const isAdmin = ref(true)
const changes = ref<Record<string, User & { action?: string }>>({})
const dialogVisible = ref(false)
const currentStudent = ref<User | null>(null)
const dialogTitle = ref('')
const history = ref<User[][]>([])
const historyIndex = ref(-1)
const exportDialogVisible = ref(false)
const exportSettings = ref({
  selectedFields: [
    'name',
    'avatarUrl',
    'bio',
    'email',
    'phone',
    'address',
    'birthdate',
    'occupation',
    'subjects',
    'vkLink'
  ]
})

const checkUserRole = async () => {
  try {
    const [error, response] = await authService.check<{ id_role: string }>()

    if (!error && response?.data?.data?.id_role === 'admin') {
      isAdmin.value = true
    }
  } catch (error) {
    isAdmin.value = true

    console.error('Ошибка при проверке роли:', error)
  }
}

const fetchStudents = async () => {
  try {
    const [error, response] = await userService.getStudents()

    if (!error && response?.data?.data) {
      students.value = response.data.data
    } else {
      students.value = getMockStudents()
    }

    saveHistory()
  } catch (error) {
    students.value = getMockStudents()

    console.error('Ошибка при загрузке учеников:', error)
  }
}

const filteredStudents = computed(() => {
  return students.value.filter((student) => student.name?.toLowerCase().includes(search.value.toLowerCase()))
})

const openEditDialog = (student: User) => {
  currentStudent.value = { ...student }

  dialogTitle.value = 'Редактирование ученика'

  dialogVisible.value = true
}

const openAddDialog = () => {
  currentStudent.value = {
    id: Date.now().toString(),
    name: '',
    avatarUrl: '',
    bio: '',
    email: '',
    phone: '',
    address: '',
    birthdate: '',
    occupation: '',
    subjects: [],
    vkLink: ''
  }

  dialogTitle.value = 'Добавление ученика'

  dialogVisible.value = true
}

const saveStudent = (student: User) => {
  if (student.id) {
    const index = students.value.findIndex((s) => s.id === student.id)

    if (index !== -1) {
      students.value[index] = { ...student }
    } else {
      students.value.push({ ...student })
    }
  }

  saveHistory()

  dialogVisible.value = false
}

const confirmDelete = (studentId: string) => {
  changes.value[studentId] = { ...students.value.find((student) => student.id === studentId), action: 'delete' }

  students.value = students.value.filter((student) => student.id !== studentId)

  saveHistory()
}

const saveChanges = async () => {
  try {
    for (const [id, change] of Object.entries(changes.value)) {
      if (change.action === 'delete') {
        await userService.deleteStudent(id)
      } else {
        await userService.updateStudent(id, change)
      }
    }

    ElNotification({
      title: 'Успешно',
      message: 'Изменения сохранены',
      type: 'success'
    })

    changes.value = {}

    fetchStudents()
  } catch (error) {
    ElNotification({
      title: 'Ошибка',
      message: 'Не удалось сохранить изменения',
      type: 'error'
    })

    console.error('Ошибка при сохранении изменений:', error)
  }
}

const cancelChanges = () => {
  changes.value = {}

  fetchStudents()
}

const saveHistory = () => {
  history.value = history.value.slice(0, historyIndex.value + 1)

  history.value.push([...students.value])

  historyIndex.value++
}

const canUndo = computed(() => historyIndex.value > 0)
const canRedo = computed(() => historyIndex.value < history.value.length - 1)

const undo = () => {
  if (canUndo.value) {
    historyIndex.value--

    students.value = [...history.value[historyIndex.value]]
  }
}

const redo = () => {
  if (canRedo.value) {
    historyIndex.value++

    students.value = [...history.value[historyIndex.value]]
  }
}

const openExportDialog = () => {
  exportDialogVisible.value = true
}

const exportToExcel = () => {
  const selectedFields = exportSettings.value.selectedFields
  const data = students.value.map((student) => {
    const row: Record<string, any> = {}

    selectedFields.forEach((field) => {
      row[field] = student[field as keyof User]
    })

    return row
  })

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Ученики')

  XLSX.writeFile(workbook, 'Ученики.xlsx')

  exportDialogVisible.value = false
}

const getMockStudents = () => {
  return [
    {
      id: '1',
      name: 'Иван Иванов',
      avatarUrl: 'https://example.com/avatar1.jpg',
      bio: 'Любит математику и физику.',
      email: 'ivan@example.com',
      phone: '+7 999 123 45 67',
      address: 'Москва, ул. Ленина, 1',
      birthdate: '2005-01-01',
      occupation: 'Студент',
      subjects: ['Математика', 'Физика'],
      vkLink: 'https://vk.com/ivanov'
    },
    {
      id: '2',
      name: 'Мария Петрова',
      avatarUrl: 'https://example.com/avatar2.jpg',
      bio: 'Увлекается биологией и химией.',
      email: 'maria@example.com',
      phone: '+7 999 765 43 21',
      address: 'Санкт-Петербург, ул. Пушкина, 2',
      birthdate: '2006-05-15',
      occupation: 'Студентка',
      subjects: ['Биология', 'Химия'],
      vkLink: 'https://vk.com/petrova'
    },
    {
      id: '2',
      name: 'Мария Петрова',
      avatarUrl: 'https://example.com/avatar2.jpg',
      bio: 'Увлекается биологией и химией.',
      email: 'maria@example.com',
      phone: '+7 999 765 43 21',
      address: 'Санкт-Петербург, ул. Пушкина, 2',
      birthdate: '2006-05-15',
      occupation: 'Студентка',
      subjects: ['Биология', 'Химия'],
      vkLink: 'https://vk.com/petrova'
    },
    {
      id: '2',
      name: 'Мария Петрова',
      avatarUrl: 'https://example.com/avatar2.jpg',
      bio: 'Увлекается биологией и химией.',
      email: 'maria@example.com',
      phone: '+7 999 765 43 21',
      address: 'Санкт-Петербург, ул. Пушкина, 2',
      birthdate: '2006-05-15',
      occupation: 'Студентка',
      subjects: ['Биология', 'Химия'],
      vkLink: 'https://vk.com/petrova'
    },
    {
      id: '2',
      name: 'Мария Петрова',
      avatarUrl: 'https://example.com/avatar2.jpg',
      bio: 'Увлекается биологией и химией.',
      email: 'maria@example.com',
      phone: '+7 999 765 43 21',
      address: 'Санкт-Петербург, ул. Пушкина, 2',
      birthdate: '2006-05-15',
      occupation: 'Студентка',
      subjects: ['Биология', 'Химия'],
      vkLink: 'https://vk.com/petrova'
    },
    {
      id: '2',
      name: 'Мария Петрова',
      avatarUrl: 'https://example.com/avatar2.jpg',
      bio: 'Увлекается биологией и химией.',
      email: 'maria@example.com',
      phone: '+7 999 765 43 21',
      address: 'Санкт-Петербург, ул. Пушкина, 2',
      birthdate: '2006-05-15',
      occupation: 'Студентка',
      subjects: ['Биология', 'Химия'],
      vkLink: 'https://vk.com/petrova'
    },
    {
      id: '2',
      name: 'Мария Петрова',
      avatarUrl: 'https://example.com/avatar2.jpg',
      bio: 'Увлекается биологией и химией.',
      email: 'maria@example.com',
      phone: '+7 999 765 43 21',
      address: 'Санкт-Петербург, ул. Пушкина, 2',
      birthdate: '2006-05-15',
      occupation: 'Студентка',
      subjects: ['Биология', 'Химия'],
      vkLink: 'https://vk.com/petrova'
    },
    {
      id: '2',
      name: 'Мария Петрова',
      avatarUrl: 'https://example.com/avatar2.jpg',
      bio: 'Увлекается биологией и химией.',
      email: 'maria@example.com',
      phone: '+7 999 765 43 21',
      address: 'Санкт-Петербург, ул. Пушкина, 2',
      birthdate: '2006-05-15',
      occupation: 'Студентка',
      subjects: ['Биология', 'Химия'],
      vkLink: 'https://vk.com/petrova'
    },
    {
      id: '2',
      name: 'Мария Петрова',
      avatarUrl: 'https://example.com/avatar2.jpg',
      bio: 'Увлекается биологией и химией.',
      email: 'maria@example.com',
      phone: '+7 999 765 43 21',
      address: 'Санкт-Петербург, ул. Пушкина, 2',
      birthdate: '2006-05-15',
      occupation: 'Студентка',
      subjects: ['Биология', 'Химия'],
      vkLink: 'https://vk.com/petrova'
    },
    {
      id: '2',
      name: 'Мария Петрова',
      avatarUrl: 'https://example.com/avatar2.jpg',
      bio: 'Увлекается биологией и химией.',
      email: 'maria@example.com',
      phone: '+7 999 765 43 21',
      address: 'Санкт-Петербург, ул. Пушкина, 2',
      birthdate: '2006-05-15',
      occupation: 'Студентка',
      subjects: ['Биология', 'Химия'],
      vkLink: 'https://vk.com/petrova'
    },
    {
      id: '2',
      name: 'Мария Петрова',
      avatarUrl: 'https://example.com/avatar2.jpg',
      bio: 'Увлекается биологией и химией.',
      email: 'maria@example.com',
      phone: '+7 999 765 43 21',
      address: 'Санкт-Петербург, ул. Пушкина, 2',
      birthdate: '2006-05-15',
      occupation: 'Студентка',
      subjects: ['Биология', 'Химия'],
      vkLink: 'https://vk.com/petrova'
    },
    {
      id: '2',
      name: 'Мария Петрова',
      avatarUrl: 'https://example.com/avatar2.jpg',
      bio: 'Увлекается биологией и химией.',
      email: 'maria@example.com',
      phone: '+7 999 765 43 21',
      address: 'Санкт-Петербург, ул. Пушкина, 2',
      birthdate: '2006-05-15',
      occupation: 'Студентка',
      subjects: ['Биология', 'Химия'],
      vkLink: 'https://vk.com/petrova'
    },
    {
      id: '2',
      name: 'Мария Петрова',
      avatarUrl: 'https://example.com/avatar2.jpg',
      bio: 'Увлекается биологией и химией.',
      email: 'maria@example.com',
      phone: '+7 999 765 43 21',
      address: 'Санкт-Петербург, ул. Пушкина, 2',
      birthdate: '2006-05-15',
      occupation: 'Студентка',
      subjects: ['Биология', 'Химия'],
      vkLink: 'https://vk.com/petrova'
    },
    {
      id: '2',
      name: 'Мария Петрова',
      avatarUrl: 'https://example.com/avatar2.jpg',
      bio: 'Увлекается биологией и химией.',
      email: 'maria@example.com',
      phone: '+7 999 765 43 21',
      address: 'Санкт-Петербург, ул. Пушкина, 2',
      birthdate: '2006-05-15',
      occupation: 'Студентка',
      subjects: ['Биология', 'Химия'],
      vkLink: 'https://vk.com/petrova'
    }
  ]
}

onMounted(() => {
  checkUserRole()

  fetchStudents()
})
</script>

<style scoped lang="scss">
.students-page {
  padding: 0px;
  overflow-y: auto;
  background-color: var(--color-light);
  border-radius: 0px;
  display: flex;
  flex-direction: column;
  height: 90vh;
}
.students-page::-webkit-scrollbar {
  display: none;
}

.page-title {
  font-size: 2rem;
  margin-bottom: 20px;
  color: var(--color-dark)-light;
  text-align: left;
}
.table-container {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 0px;
}
.table-container::-webkit-scrollbar {
  display: none;
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  margin-right: 20px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.students-table {
  margin-bottom: 20px;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease;
  border: 1px solid $color-emerald;

  &:hover {
    transform: translateY(-2px);
  }
}

.edit-btn,
.delete-btn {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.edit-btn:hover {
  transform: scale(1);
  color: $color-emerald;
}

.delete-btn:hover {
  transform: scale(1);
  background-color: red;
}

.add-student-btn {
  margin-top: 5px;
  width: 100%;
  background: linear-gradient(90deg, $color-primary-gradient);
  border: none;
  color: var(--color-white);
  font-weight: bold;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
}
.modern-button {
  background: linear-gradient(90deg, $color-primary-gradient);
  border: none;
  color: var(--color-white);
  font-weight: bold;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: $box-shadow;
  }
}
.modern-butst {
  background-color: transparent !important;
  border: none !important;
  width: 20px;
}
.arrows {
  color: $color-emerald;
  font-size: 20px;

  &:disabled {
    color: $color-black;
  }
}
</style>
