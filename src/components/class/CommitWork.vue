<template>
  <div>
      
    <el-tabs type="border-card">
        <el-tab-pane label="上传作业">
            <el-table :data="taskList" style="width: 100%">
                <el-table-column prop="taskName" label="作业名" width="180" />
                <el-table-column prop="startTime" label="开始时间" width="180" />
                <el-table-column prop="stopTime" label="截止时间"  width="180"/>

                <el-table-column fixed="right" label="操作" >
                    <template #default="scope">
                        <el-button type="primary"  size="mini" @click="seeDescription(scope.row.description)">查看描述</el-button>
                        <el-button type="primary"  size="mini" @click="uploadTask(scope.row.id)" v-if="scope.row.isUpload">上交作业</el-button>
                    </template>
                </el-table-column>

            </el-table>
        </el-tab-pane>
        <el-tab-pane label="其他">还未开发</el-tab-pane>
    </el-tabs>

    <!-- 对话框 -->
     <el-dialog
        v-model="dialogVisible"
        title="上传作业"
        width="50%"
        :before-close="handleClose"
    >
        <el-form>
            <el-form-item label="运行截图">
                <el-upload
                    :action="upLoadFile"   
                    list-type="picture-card"   
                    :file-list="imgs_url"    
                    :limit="9"    
                    accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
                    :on-success="handleAvatarSuccess"    
                    >
                    <el-icon><upload /></el-icon>
                
                </el-upload>
                <div slot="tip" class="el-upload__tip">最多上传9张运行截图, 只能上传jpg/png/jpeg文件</div>
            </el-form-item>

            <el-form-item label="上机报告">
                <el-upload
                    :action="upLoadFile"   
                    :file-list="fileArr"    
                    :limit="1"  
                    drag
                    :on-success="fileUploadSuccess"    
                    >
                    <div slot="tip" class="el-upload__tip">最多上传一个文件, 可以拖拽到此处</div>
                    <el-icon size="80"><upload /></el-icon>
                </el-upload>

            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="uploadHomeWork">添加</el-button>
                <el-button @click="resetHomework">重置</el-button>
            </el-form-item>

        </el-form>
    </el-dialog>
  </div>

</template>
<script>

import { ElMessage , ElMessageBox } from 'element-plus'
import { ref } from 'vue'
import { Upload } from '@element-plus/icons'
export default {  
    setup() {
        const dialogVisible = ref(false)
        const handleClose = (done) => {
        ElMessageBox.confirm('确定关闭对话框?')
            .then(() => {
                done()
            })
            .catch(() => {
            // catch error
            })
        }
        return {
            dialogVisible,
            handleClose,
        }
    },

    components: {
        Upload,
    },
    name: "CommitWork",
    
    created() {
        // 初始化数据
        // 1， 获取所有 作业列表，
        this.cid = this.courseId
        this.init()
        this.userInfo = this.$store.getters.getUser
    },
    
    data() {
        return {
            cid: "",
            taskList: [],
            taskId: "",
            userInfo: "",
            imgs_url: [],
            fileUrl: "",
            imgsName: [],
            fileName: "",
        }
    },
    props: ['courseId'],
    methods: {
        init() {
            this.$axios.get("/course-task/getAll?courseId=" + this.cid).then(res => {
                const data = res.data
                if (data.code == 200) {
                    this.taskList = data.data
                    ElMessage.success('获取作业列表成功', {duration: 3 * 1000})
                } else {
                    ElMessage.error('获取作业列表失败', {duration: 3 * 1000})
                }
            })
        },
        seeDescription(val) {
            ElMessageBox.alert(val, '作业描述', {
                confirmButtonText: 'OK',
            })
        },
        uploadTask(val) {
            // console.log(val)
            this.dialogVisible = true
            this.taskId = val
        },
        
        handleAvatarSuccess(res) {
            // 处理上传图标
            if (res.code === 200) {
                this.imgs_url.push({ url: res.data.fileDownloadUri })
                this.imgsName.push(res.data.fileName)
                ElMessage.success("图片上传成功", {duration: 3 * 1000})

            } else {
                ElMessage.error('图片上传失败', {duration: 3 * 1000})
            }
       },
       fileUploadSuccess(res) {
            // 处理上传图标
            if (res.code === 200) {
                this.fileUrl = res.data.fileDownloadUri
                this.fileName = res.data.fileName
                ElMessage.success("报告上传成功", {duration: 3 * 1000})
            } else {
                ElMessage.error('报告上传失败', {duration: 3 * 1000})
            }
       },
        // 上传作业
       uploadHomeWork() {

            if (this.imgs_url == null || this.imgs_url.length == 0) {
               ElMessage.error("请上传运行截图", {duration: 3 * 1000})
               return false
            }
            if (this.fileUrl == null || this.fileUrl == "") {
               ElMessage.error("请上传报告", {duration: 3 * 1000})
               return false
            }

            
            this.$axios.post("/homework/upload", {
               
               "userId": this.userInfo.id,
               "taskId": this.taskId,
               "taskFile": this.fileName,
               "imgs": this.imgsName,

            }).then(res => {
            
               const data = res.data
               if (data.code == 200) {
                   ElMessage.success("报告上传成功", {duration: 3 * 1000})
                   this.resetHomework()
               } else {
                   ElMessage.error("报告上传失败", {duration: 3 * 1000})
               }
            })
        },
       
        resetHomework() {
           this.fileUrl = ""
           this.imgs_url = []
           this.imgsName = []
        }

    },
    watch: {
        'courseId': function(val) {
        this.cid = val
        this.init()
      }
    },
    computed: {
        fileArr() {
            // 上传图片 显示默认图片
            return this.fileUrl ? [{ url: this.fileUrl }] : []
        },

        upLoadFile() {
            return this.$updLoad
        }
    }

}
</script>

<style>

</style>