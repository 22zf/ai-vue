<template>
  <div class="article-page">
    <!-- 页面顶部：标题 + 新增按钮 -->
    <PageHead title="知识文章">
      <template #buttons>
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </template>
    </PageHead>

    <!-- 搜索区域 -->
    <TableSearch @search="handleSearch" />

    <!-- 表格区域 -->
    <div class="table-container">
      <DataTable :tableData="tableData" @edit="handleEdit" @delete="handleDelete" />

      <!-- 分页器 -->
      <div class="pagination-area">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[8, 10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- ========== 新增/编辑文章对话框 ========== -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑文章' : '新增文章'"
      width="800px"
      @close="handleClose"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="文章标题" prop="title">
          <div class="title-input-wrapper">
            <el-input
              v-model="form.title"
              placeholder="请输入文章标题"
              maxlength="200"
              show-word-limit
            />
          </div>
        </el-form-item>

        <el-form-item label="所属分类" prop="categoryId">
          <el-select v-model="form.categoryId" placeholder="请选择分类" style="width: 100%">
            <el-option
              v-for="item in categoryOptions"
              :key="item.id"
              :label="item.categoryName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="文章摘要" prop="summary">
          <el-input
            v-model="form.summary"
            type="textarea"
            :rows="4"
            placeholder="请输入文章摘要"
            maxlength="1000"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="标签" prop="tags">
          <el-select
            v-model="form.tags"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择或输入标签"
            style="width: 100%"
          >
            <el-option
              v-for="item in tagOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="封面图片" prop="coverImage">
          <div class="cover-upload-wrapper">
            <input
              ref="fileInputRef"
              type="file"
              accept="image/*"
              style="display: none"
              @change="handleFileSelect"
            />
            <div class="cover-preview" @click="triggerFileSelect">
              <img v-if="form.coverImage" :src="form.coverImage" class="cover-image" />
              <div v-else class="cover-placeholder">
                <el-icon class="cover-uploader-icon"><Plus /></el-icon>
                <span>点击上传封面</span>
              </div>
            </div>
            <el-button
              v-if="form.coverImage"
              type="danger"
              size="small"
              @click="handleRemoveCover"
            >
              移除封面
            </el-button>
          </div>
        </el-form-item>

        <el-form-item label="文章内容" prop="content">
          <RichTextEditor v-model="form.content" placeholder="请输入文章内容" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import PageHead from '@/components/PageHead.vue'
import TableSearch from '@/components/TableSearch.vue'
import DataTable from '@/components/DataTable.vue'
import RichTextEditor from '@/components/RichTextEditor.vue'
import { categoryTree, uploadFile, articleAdd, articlePage, articleDetail, articleUpdate, articleDelete } from '@/api/admin'

/* ========== 1. 文章列表 ========== */

const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(8)
const total = ref(0)

// 搜索条件
const searchKeyword = ref('')

function loadData() {
  const params = {
    currentPage: currentPage.value,
    size: pageSize.value
  }
  if (searchKeyword.value) {
    params.title = searchKeyword.value
  }
  articlePage(params)
    .then(res => {
      tableData.value = res.records || []
      total.value = res.total || 0
    })
    .catch(() => {
      ElMessage.error('获取文章列表失败')
    })
}

function handleSearch(val) {
  searchKeyword.value = val.title || ''
  currentPage.value = 1
  loadData()
}

function handleSizeChange(val) {
  pageSize.value = val
  currentPage.value = 1
  loadData()
}

function handleCurrentChange(val) {
  currentPage.value = val
  loadData()
}

onMounted(() => {
  loadData()
})

/* ========== 2. 新增/编辑对话框 ========== */

const dialogVisible = ref(false)
const isEdit = ref(false)
const editingId = ref(null)
const dialogLoading = ref(false)

const categoryOptions = ref([])
const tagOptions = ref(['情绪管理', '压力缓解', '焦虑', '抑郁', '人际关系', '心理健康', '自我成长', '睡眠', '职场心理', '亲子关系'])

const form = reactive({
  title: '',
  categoryId: null,
  summary: '',
  tags: [],
  coverImage: '',
  content: ''
})

const rules = {
  title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择所属分类', trigger: 'change' }],
  content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }]
}

const formRef = ref(null)

// 打开新增
function handleAdd() {
  isEdit.value = false
  editingId.value = null
  resetForm()
  loadCategoryOptions()
  dialogVisible.value = true
}

// 打开编辑
function handleEdit(row) {
  isEdit.value = true
  editingId.value = row.id
  dialogLoading.value = true
  dialogVisible.value = true
  loadCategoryOptions()

  // 获取文章详情（含 content）
  articleDetail(row.id)
    .then(res => {
      form.title = res.title || ''
      form.categoryId = res.categoryId
      form.summary = res.summary || ''
      form.tags = res.tagArray || []
      form.coverImage = res.coverImage || ''
      form.content = res.content || ''
    })
    .catch(() => {
      ElMessage.error('获取文章详情失败')
      dialogVisible.value = false
    })
    .finally(() => {
      dialogLoading.value = false
    })
}

function resetForm() {
  form.title = ''
  form.categoryId = null
  form.summary = ''
  form.tags = []
  form.coverImage = ''
  form.content = ''
}

// 加载分类下拉选项
function loadCategoryOptions() {
  if (categoryOptions.value.length === 0) {
    categoryTree().then(data => {
      categoryOptions.value = data || []
    }).catch(() => {})
  }
}

// 提交
function handleSubmit() {
  formRef.value.validate((valid) => {
    if (!valid) return

    const params = {
      title: form.title,
      categoryId: form.categoryId,
      summary: form.summary,
      tags: form.tags.join(','),
      coverImage: form.coverImage,
      content: form.content
    }

    if (isEdit.value) {
      params.id = editingId.value
      articleUpdate(params)
        .then(() => {
          ElMessage.success('文章修改成功')
          dialogVisible.value = false
          loadData()
        })
        .catch(() => {
          ElMessage.error('文章修改失败')
        })
    } else {
      articleAdd(params)
        .then(() => {
          ElMessage.success('文章新增成功')
          dialogVisible.value = false
          loadData()
        })
        .catch(() => {
          ElMessage.error('文章新增失败')
        })
    }
  })
}

function handleClose() {
  formRef.value?.resetFields()
}

/* ========== 3. 封面上传 ========== */

const fileInputRef = ref(null)

function triggerFileSelect() {
  fileInputRef.value?.click()
}

function handleFileSelect(event) {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    ElMessage.error('只能上传图片文件!')
    return
  }
  if (file.size / 1024 / 1024 >= 2) {
    ElMessage.error('图片大小不能超过 2MB!')
    return
  }

  const loadingMsg = ElMessage({ message: '正在上传封面...', duration: 0 })
  uploadFile(file, { businessId: editingId.value || Date.now() })
    .then(res => {
      form.coverImage = res.filePath
      ElMessage.success('封面上传成功')
    })
    .catch(() => {
      ElMessage.error('封面上传失败')
    })
    .finally(() => {
      loadingMsg.close()
      event.target.value = ''
    })
}

function handleRemoveCover() {
  form.coverImage = ''
}

/* ========== 4. 删除 ========== */

function handleDelete(row) {
  ElMessageBox.confirm('确定要删除该文章吗？', '提示', { type: 'warning' })
    .then(() => {
      articleDelete(row.id)
        .then(() => {
          ElMessage.success('删除成功')
          loadData()
        })
        .catch(() => {
          ElMessage.error('删除失败')
        })
    })
    .catch(() => {})
}
</script>

<style scoped>
.article-page {
  background-color: #f5f7fa;
  min-height: 100%;
}

.table-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  margin-top: 20px;
}

.pagination-area {
  display: flex;
  justify-content: flex-end;
  padding-top: 15px;
  margin-top: 15px;
  border-top: 1px solid #ebeef5;
  overflow-x: auto;
}

.title-input-wrapper {
  width: 100%;
}

.cover-upload-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cover-preview {
  width: 200px;
  height: 150px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cover-preview:hover {
  border-color: #409eff;
}

.cover-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #8c939d;
  font-size: 13px;
}

.cover-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}

.cover-image {
  width: 200px;
  height: 150px;
  display: block;
  object-fit: cover;
}
</style>
