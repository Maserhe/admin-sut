<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部" name="first">
            <el-table :data="getData.slice((currentPage-1)* pagesize, currentPage* pagesize)">

              <el-table-column type="index" >    
              </el-table-column>
              <el-table-column label="课程" prop="date" >    
              </el-table-column>
              <el-table-column label="作业名" prop="name" >    
              </el-table-column>
              <el-table-column label="作者" prop="email" >    
              </el-table-column>
              <el-table-column label="分数" prop="address">     
              </el-table-column> 

              <el-table-column label="操作">
                  <template #header>
                    <el-input v-model="search" size="mini" placeholder="输入课程或者作业名搜索" />
                  </template>
                  <template #default="scope">
                      <el-button type="primary" size="mini" @click="downloadFile(scope.row.file)">查看</el-button>
                      <el-button type="primary" size="mini" @click="deleteFile(scope.row.id)">打分</el-button>
                  </template>
              </el-table-column>

            </el-table>

            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[5, 10, 20, 40]" 
                :page-size="pagesize"         
                layout="total, sizes, prev, pager, next, jumper"
                :total="getData.length">    
            </el-pagination>

        </el-tab-pane>
        <el-tab-pane label="筛选" name="second">
            <h1>可以打分的列表</h1>
        
        </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
export default {
    name: "StuHome",
    data() {
      return {
        activeName: 'first',
        currentPage: 1,
        pagesize: 10,
        allList: [
            {
              date: "11",
              name: "1234"
            },
            {
              date: "1",
              name: "154323"
            },
            {
              date: "1",
              name: "12453"
            },
            {
              date: "1",
              name: "1243"
            },
            {
              date: "1",
              name: "1243"
            },
            {
              date: "11",
              name: "123"
            },
            {
              date: "11",
              name: "123"
            },
            {
              date: "11",
              name: "123"
            },
                        {
              date: "11",
              name: "123"
            },
            {
              date: "1",
              name: "123"
            },
            {
              date: "11",
              name: "123"
            },
            {
              date: "1",
              name: "123"
            },
            {
              date: "1",
              name: "123"
            },
            {
              date: "1",
              name: "123"
            },
            {
              date: "1",
              name: "123"
            },
            {
              date: "1",
              name: "123"
            },
                        {
              date: "1",
              name: "123"
            },
            {
              date: "1",
              name: "123"
            },
            {
              date: "1",
              name: "123"
            },
            {
              date: "1",
              name: "123"
            },
            {
              date: "1",
              name: "123"
            },
            {
              date: "1",
              name: "123"
            },
            {
              date: "1",
              name: "123"
            },
            {
              date: "1",
              name: "123"
            },
        ], 
        filterList: [],
        search: "",

       
      }
    },
    methods: {

      handleClick(tab, event) {
        console.log(tab, event)

      },
      handleSizeChange: function (size) {
        this.pagesize = size;
        console.log(this.pagesize)
      },
      handleCurrentChange: function(currentPage){
        this.currentPage = currentPage;
        console.log(this.currentPage) 
      },
      handleUserList() {
        
      },


    },

    computed: {
      
      // 返回搜索回去的结果
      getData() {
          return this.allList.filter( (data) => ! this.search || data.name.toLowerCase().includes(this.search.toLowerCase()) || data.date.toLowerCase().includes(this.search.toLowerCase())  )
      },


    }

}
</script>

<style>

</style>

