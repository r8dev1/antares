<template>
   <Teleport to="#window-content">
      <div class="modal active">
         <a class="modal-overlay" @click.stop="closeModal" />
         <div ref="trapRef" class="modal-container p-0">
            <div class="modal-header pl-2">
               <div class="modal-title h6">
                  <div class="d-flex">
                     <i class="mdi mdi-24px mdi-database-export mr-1" />
                     <span class="cut-text">{{ t('message.exportSchema') }}</span>
                  </div>
               </div>
               <a class="btn btn-clear c-hand" @click.stop="closeModal" />
            </div>
            <div class="modal-body pb-0">
               <div class="container">
                  <div class="columns">
                     <div class="col-3">
                        <label class="form-label">{{ t('message.directoryPath') }}</label>
                     </div>
                     <div class="col-9">
                        <fieldset class="input-group">
                           <input
                              v-model="basePath"
                              class="form-input"
                              type="text"
                              required
                              readonly
                              :placeholder="t('message.schemaName')"
                           >
                           <button
                              type="button"
                              class="btn btn-primary input-group-btn"
                              @click.prevent="openPathDialog"
                           >
                              {{ t('word.change') }}
                           </button>
                        </fieldset>
                     </div>
                  </div>
               </div>

               <div class="columns export-options">
                  <div class="column col-8 left">
                     <div class="columns mb-2">
                        <div class="column col-auto d-flex text-italic ">
                           <i class="mdi mdi-file-document-outline mr-2" />
                           {{ filename }}
                        </div>

                        <div class="column col-auto col-ml-auto ">
                           <button
                              class="btn btn-dark btn-sm"
                              :title="t('word.refresh')"
                              @click="refresh"
                           >
                              <i class="mdi mdi-database-refresh" />
                           </button>
                           <button
                              class="btn btn-dark btn-sm mx-1"
                              :title="t('message.uncheckAllTables')"
                              :disabled="isRefreshing"
                              @click="uncheckAllTables"
                           >
                              <i class="mdi mdi-file-tree-outline" />
                           </button>
                           <button
                              class="btn btn-dark btn-sm"
                              :title="t('message.checkAllTables')"
                              :disabled="isRefreshing"
                              @click="checkAllTables"
                           >
                              <i class="mdi mdi-file-tree" />
                           </button>
                        </div>
                     </div>
                     <div class="workspace-query-results">
                        <div ref="table" class="table table-hover">
                           <div class="thead">
                              <div class="tr text-center">
                                 <div class="th no-border" :style="'width: 50%;'" />
                                 <div class="th no-border">
                                    <label
                                       class="form-checkbox m-0 px-2 form-inline"
                                       @click.prevent="toggleAllTablesOption('includeStructure')"
                                    >
                                       <input
                                          type="checkbox"
                                          :indeterminate="includeStructureStatus === 2"
                                          :checked="!!includeStructureStatus"
                                       >
                                       <i class="form-icon" />
                                    </label>
                                 </div>
                                 <div class="th no-border">
                                    <label
                                       class="form-checkbox m-0 px-2 form-inline"
                                       @click.prevent="toggleAllTablesOption('includeContent')"
                                    >
                                       <input
                                          type="checkbox"
                                          :indeterminate="includeContentStatus === 2"
                                          :checked="!!includeContentStatus"
                                       >
                                       <i class="form-icon" />
                                    </label>
                                 </div>
                                 <div class="th no-border">
                                    <label
                                       class="form-checkbox m-0 px-2 form-inline"
                                       @click.prevent="toggleAllTablesOption('includeDropStatement')"
                                    >
                                       <input
                                          type="checkbox"
                                          :indeterminate="includeDropStatementStatus === 2"
                                          :checked="!!includeDropStatementStatus"
                                       >
                                       <i class="form-icon" />
                                    </label>
                                 </div>
                              </div>
                              <div class="tr">
                                 <div class="th" :style="'width: 50%;'">
                                    <div class="table-column-title">
                                       <span>{{ t('word.table') }}</span>
                                    </div>
                                 </div>
                                 <div class="th text-center">
                                    <div class="table-column-title">
                                       <span>{{ t('word.structure') }}</span>
                                    </div>
                                 </div>
                                 <div class="th text-center">
                                    <div class="table-column-title">
                                       <span>{{ t('word.content') }}</span>
                                    </div>
                                 </div>
                                 <div class="th text-center">
                                    <div class="table-column-title">
                                       <span>{{ t('word.drop') }}</span>
                                    </div>
                                 </div>
                              </div>
                           </div>

                           <div class="tbody">
                              <div
                                 v-for="item in tables"
                                 :key="item.table"
                                 class="tr"
                              >
                                 <div class="td">
                                    {{ item.table }}
                                 </div>
                                 <div class="td text-center">
                                    <label class="form-checkbox m-0 px-2 form-inline">
                                       <input
                                          v-model="item.includeStructure"
                                          type="checkbox"
                                       ><i class="form-icon" />
                                    </label>
                                 </div>
                                 <div class="td text-center">
                                    <label class="form-checkbox m-0 px-2 form-inline">
                                       <input
                                          v-model="item.includeContent"
                                          type="checkbox"
                                       ><i class="form-icon" />
                                    </label>
                                 </div>
                                 <div class="td text-center">
                                    <label class="form-checkbox m-0 px-2 form-inline">
                                       <input
                                          v-model="item.includeDropStatement"
                                          type="checkbox"
                                       ><i class="form-icon" />
                                    </label>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div class="column col-4">
                     <h5 class="h5">
                        {{ t('word.options') }}
                     </h5>
                     <span class="h6">{{ t('word.includes') }}:</span>
                     <label
                        v-for="(_, key) in options.includes"
                        :key="key"
                        class="form-checkbox"
                     >
                        <input v-model="options.includes[key]" type="checkbox"><i class="form-icon" /> {{ t(`word.${key}`, 2) }}
                     </label>
                     <div v-if="clientCustoms.exportByChunks">
                        <div class="h6 mt-4 mb-2">
                           {{ t('message.newInserStmtEvery') }}:
                        </div>
                        <div class="columns">
                           <div class="column col-6">
                              <input
                                 v-model.number="options.sqlInsertAfter"
                                 type="number"
                                 class="form-input"
                              >
                           </div>
                           <div class="column col-6">
                              <BaseSelect
                                 v-model="options.sqlInsertDivider"
                                 class="form-select"
                                 :options="[{value: 'bytes', label: 'KiB'}, {value: 'rows', label: t('word.row', 2)}]"
                              />
                           </div>
                        </div>
                     </div>

                     <div class="h6 mb-2 mt-4">
                        {{ t('message.ourputFormat') }}:
                     </div>
                     <div class="columns">
                        <div class="column h5 mb-4">
                           <BaseSelect
                              v-model="options.outputFormat"
                              class="form-select"
                              :options="[{value: 'sql', label: t('message.singleFile', {ext: '.sql'})}, {value: 'sql.zip', label: t('message.zipCompressedFile', {ext: '.sql'})}]"
                           />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div class="modal-footer columns">
               <div class="column col modal-progress-wrapper text-left">
                  <div v-if="progressPercentage > 0" class="export-progress">
                     <span class="progress-status">
                        {{ progressPercentage }}% - {{ progressStatus }}
                     </span>
                     <progress
                        class="progress d-block"
                        :value="progressPercentage"
                        max="100"
                     />
                  </div>
               </div>
               <div class="column col-auto px-0">
                  <button class="btn btn-link" @click.stop="closeModal">
                     {{ t('word.close') }}
                  </button>
                  <button
                     class="btn btn-primary mr-2"
                     :class="{'loading': isExporting}"
                     :disabled="isExporting || isRefreshing"
                     autofocus
                     @click.prevent="startExport"
                  >
                     {{ t('word.export') }}
                  </button>
               </div>
            </div>
         </div>
      </div>
   </Teleport>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, Ref, ref } from 'vue';
import * as moment from 'moment';
import { ipcRenderer } from 'electron';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { ClientCode, SchemaInfos } from 'common/interfaces/antares';
import { ExportOptions, ExportState } from 'common/interfaces/exporter';
import { useNotificationsStore } from '@/stores/notifications';
import { useWorkspacesStore } from '@/stores/workspaces';
import { useFocusTrap } from '@/composables/useFocusTrap';
import Application from '@/ipc-api/Application';
import Schema from '@/ipc-api/Schema';
import { Customizations } from 'common/interfaces/customizations';
import BaseSelect from '@/components/BaseSelect.vue';

const props = defineProps({
   selectedSchema: String
});

const emit = defineEmits(['close']);
const { t } = useI18n();

const { addNotification } = useNotificationsStore();
const workspacesStore = useWorkspacesStore();

const { getSelected: selectedWorkspace } = storeToRefs(workspacesStore);

const { trapRef } = useFocusTrap();

const {
   getWorkspace,
   refreshSchema
} = workspacesStore;

const isExporting = ref(false);
const isRefreshing = ref(false);
const progressPercentage = ref(0);
const progressStatus = ref('');
const tables: Ref<{
   table: string;
   includeStructure: boolean;
   includeContent: boolean;
   includeDropStatement: boolean;
}[]> = ref([]);
const options: Ref<Partial<ExportOptions>> = ref({
   schema: props.selectedSchema,
   includes: {} as {[key: string]: boolean},
   outputFormat: 'sql' as 'sql' | 'sql.zip',
   sqlInsertAfter: 250,
   sqlInsertDivider: 'bytes' as 'bytes' | 'rows'
});
const basePath = ref('');

const currentWorkspace = computed(() => getWorkspace(selectedWorkspace.value));
const clientCustoms: Ref<Customizations> = computed(() => currentWorkspace.value.customizations);
const schemaItems = computed(() => {
   const db: SchemaInfos = currentWorkspace.value.structure.find((db: SchemaInfos) => db.name === props.selectedSchema);
   if (db)
      return db.tables.filter(table => table.type === 'table');

   return [];
});
const filename = computed(() => {
   const date = moment().format('YYYY-MM-DD');
   return `${props.selectedSchema}_${date}.${options.value.outputFormat}`;
});
const dumpFilePath = computed(() => `${basePath.value}/${filename.value}`);
const includeStructureStatus = computed(() => {
   if (tables.value.every(item => item.includeStructure)) return 1;
   else if (tables.value.some(item => item.includeStructure)) return 2;
   else return 0;
});
const includeContentStatus = computed(() => {
   if (tables.value.every(item => item.includeContent)) return 1;
   else if (tables.value.some(item => item.includeContent)) return 2;
   else return 0;
});
const includeDropStatementStatus = computed(() => {
   if (tables.value.every(item => item.includeDropStatement)) return 1;
   else if (tables.value.some(item => item.includeDropStatement)) return 2;
   else return 0;
});

const startExport = async () => {
   isExporting.value = true;
   const { uid, client } = currentWorkspace.value;
   const params = {
      uid,
      type: client,
      schema: props.selectedSchema,
      outputFile: dumpFilePath.value,
      tables: [...tables.value],
      ...options.value
   } as ExportOptions & { uid: string; type: ClientCode };

   try {
      const { status, response } = await Schema.export(params);
      if (status === 'success')
         progressStatus.value = response.cancelled ? t('word.aborted') : t('word.completed');
      else {
         progressStatus.value = response;
         addNotification({ status: 'error', message: response });
      }
   }
   catch (err) {
      addNotification({ status: 'error', message: err.stack });
   }

   isExporting.value = false;
};

const updateProgress = (event: Event, state: ExportState) => {
   progressPercentage.value = Number((state.currentItemIndex / state.totalItems * 100).toFixed(1));
   switch (state.op) {
      case 'PROCESSING':
         progressStatus.value = t('message.processingTableExport', { table: state.currentItem });
         break;
      case 'FETCH':
         progressStatus.value = t('message.fechingTableExport', { table: state.currentItem });
         break;
      case 'WRITE':
         progressStatus.value = t('message.writingTableExport', { table: state.currentItem });
         break;
   }
};

const closeModal = async () => {
   let willClose = true;
   if (isExporting.value) {
      willClose = false;
      const { response } = await Schema.abortExport();
      willClose = response.willAbort;
   }

   if (willClose)
      emit('close');
};

const onKey = (e: KeyboardEvent) => {
   e.stopPropagation();
   if (e.key === 'Escape')
      closeModal();
};

const checkAllTables = () => {
   tables.value = tables.value.map(item => ({ ...item, includeStructure: true, includeContent: true, includeDropStatement: true }));
};

const uncheckAllTables = () => {
   tables.value = tables.value.map(item => ({ ...item, includeStructure: false, includeContent: false, includeDropStatement: false }));
};

const toggleAllTablesOption = (option: 'includeStructure' | 'includeContent' |'includeDropStatement') => {
   const options = {
      includeStructure: includeStructureStatus.value,
      includeContent: includeContentStatus.value,
      includeDropStatement: includeDropStatementStatus.value
   };

   if (options[option] !== 1)
      tables.value = tables.value.map(item => ({ ...item, [option]: true }));
   else
      tables.value = tables.value.map(item => ({ ...item, [option]: false }));
};

const refresh = async () => {
   isRefreshing.value = true;
   await refreshSchema({ uid: currentWorkspace.value.uid, schema: props.selectedSchema });
   isRefreshing.value = false;
};

const openPathDialog = async () => {
   const result = await Application.showOpenDialog({ properties: ['openDirectory'] });
   if (result && !result.canceled)
      basePath.value = result.filePaths[0];
};

(async () => {
   if (!schemaItems.value.length) await refresh();

   window.addEventListener('keydown', onKey);

   basePath.value = await Application.getDownloadPathDirectory();
   tables.value = schemaItems.value.map(item => ({
      table: item.name,
      includeStructure: true,
      includeContent: true,
      includeDropStatement: true
   }));

   const structure = ['functions', 'views', 'triggers', 'routines', 'schedulers'];

   structure.forEach((feat: keyof Customizations) => {
      const val = clientCustoms.value[feat];
      if (val)
         options.value.includes[feat] = true;
   });

   ipcRenderer.on('export-progress', updateProgress);
})();

onBeforeUnmount(() => {
   window.removeEventListener('keydown', onKey);
   ipcRenderer.off('export-progress', updateProgress);
});

</script>

<style lang="scss" scoped>
.export-options {
  flex: 1;
  overflow: hidden;

  .left {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
}

.workspace-query-results {
  flex: 1 0 1px;

  .table {
    width: 100% !important;
  }

  .form-checkbox {
    min-height: 0.8rem;
    padding: 0;

    .form-icon {
      top: 0.1rem;
    }
  }
}

.modal {
  .modal-container {
    max-width: 800px;
  }

  .modal-body {
    max-height: 60vh;
    display: flex;
    flex-direction: column;
  }

  .modal-footer {
    display: flex;
  }
}

.progress-status {
  font-style: italic;
  font-size: 80%;
}

</style>
