<template>
  <div>

    <ScheduleTable :filter="selectedTeacher" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ScheduleTable from '@/components/molecules/ScheduleTable.vue';

const selectedTeacher = ref<string | number>('');
const teachers = ref([
  { value: 1, label: 'Иванов И.И.' },
  { value: 2, label: 'Петров П.П.' },
]);

function updateSchedule() {
  console.log('Обновление расписания для преподавателя:', selectedTeacher.value);
}
</script>