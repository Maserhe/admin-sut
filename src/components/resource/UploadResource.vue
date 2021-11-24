<template>
    <div>

        <el-tabs v-model="activeName">
            <el-tab-pane label="资源列表" name="first">
                <el-table :data="resources" style="width: 100%">
                    <el-table-column prop="fileName" label="文件名" />
                    <el-table-column label="操作">
                        <template #default="scope">
                            <el-button type="primary" size="mini" @click="downloadFile(scope.row.file)">下载</el-button>
                            <el-button type="primary" size="mini" @click="deleteFile(scope.row.id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>

            <el-tab-pane label="上传资源" name="second">

                <el-form ref="resourceInfo" :model="resourceInfo" label-width="100px">
                    <el-form-item label="文件名" prop="fileName" :rules="[ { required: true, message: '文件名必须写' }, ]">
                        <el-input v-model.number="resourceInfo.fileName" autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item label="上机报告">
                        <el-upload
                            action="http://localhost:8080/uploadFile"   
                            :file-list="fileArr"    
                            :limit="1"  
                            drag
                            :on-success="fileUploadSuccess"    
                            >
                            <div slot="tip">最多上传一个文件, 可以拖拽到此处</div>
                            <el-icon size="80"><upload /></el-icon>
                        </el-upload>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="addResource">添加</el-button>
                        <el-button @click="resetForm">重置</el-button>
                    </el-form-item>
                </el-form>


            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { ElMessage  } from 'element-plus'
import { Upload } from '@element-plus/icons'
export default {
    components: {
        Upload,
    },

    name: "UploadResource",

    data() {
        return {
            cid: "",
            resources: [],
            activeName: 'first',
            resourceInfo: {
                courseId: "",
                file: "",
                fileName: "",
            },
            fileUrl: "",
        }
    },
    props: ['courseId'],

    created() {
        this.cid = this.courseId
        this.init()
    },

    methods: {
        
        init() {
            this.$axios.get("/resource/getAll?courseId=" + this.cid).then(res => {
                const data = res.data
                if (data.code == 200) {
                    this.resources = data.data
                } else {
                    ElMessage.error('获取资源列表失败', {duration: 3 * 1000})
                }
            })
        },
        deleteFile(id) {
            if (id == "" || id == null) return false
            this.$axios.post("/resource/delete?resourceId="+ id).then(res => {
                if (res.data.data == true) {
                    this.init()
                    ElMessage.success('删除资源成功', {duration: 3 * 1000})
                }
            })
            
        },

        addResource() {
            this.resourceInfo.courseId = this.cid
            if (this.resourceInfo.fileName == "" || this.resourceInfo.fileName == null) return false
            if (this.resourceInfo.file == "" || this.resourceInfo.file == null) return false

            this.$axios.post("/resource/upload", this.resourceInfo).then(res => {
                const data = res.data
                if (data.code == 200) {
                    ElMessage.success('添加课件成功', {duration: 3 * 1000})
                    this.init()
                }
            })
        
        },
        resetForm() {
            this.resourceInfo = {
                courseId: "",
                file: "",
                fileName: "",
            }
            this.fileUrl = ""
        },
        
        fileUploadSuccess(res) {
            // 处理上传图标
            if (res.code === 200) {
                this.resourceInfo.file = res.data.fileName
                this.fileUrl = res.data.fileDownloadUri
                ElMessage.success("报告上传成功", {duration: 3 * 1000})
            } else {
                ElMessage.error('报告上传失败', {duration: 3 * 1000})
            }
       },

       downloadFile(file) {
           window.open('http://localhost:8080/downloadFile/' + file, '_blank')
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
        }
    }

}
</script>

<style>

</style>