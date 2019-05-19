<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          保存
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <!-- <Warning /> -->

          <el-col :span="24">
            <div class="postInfo-container">
              <el-row>

                <el-col :span="10">
                  <el-form-item label-width="120px" label="用户名" prop="username" class="postInfo-container-item">
                    <el-input v-model="postForm.username" />
                  </el-form-item>
                </el-col>

                <el-col :span="10">
                  <el-form-item label-width="120px" label="密码" prop="password" class="postInfo-container-item">
                    <el-input v-model="postForm.password" />
                  </el-form-item>
                </el-col>

                <el-col :span="10">
                  <el-form-item label-width="120px" label="确认密码" prop="rptPassword" class="postInfo-container-item">
                    <el-input v-model="postForm.rptPassword" />
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label-width="120px" label="品牌" prop="brandId" class="postInfo-container-item">
                    <el-select v-model="postForm.brandId" placeholder="请选择品牌">
                      <el-option v-for="(item,index) in brandListOptions" :key="item+index" :label="item.label" :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import { fetchBrandList } from '@/api/brand'
import { createUser } from '@/api/user'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
// import Warning from './Warning'

const defaultForm = {
  username: '',
  password: '',
  rptPassword: '',
  brandId: null
}

const defaultFormLabels = {
  username: '用户名',
  password: '密码',
  rptPassword: '确认密码',
  brandId: '品牌'
}

export default {
  name: 'UserDetail',
  components: { MDinput, Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '' || value === null) {
        this.$message({
          message: defaultFormLabels[rule.field] + '为必传项',
          type: 'error'
        })
        callback(new Error(defaultFormLabels[rule.field] + '为必传项'))
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      brandListOptions: [],
      rules: {
        username: [{ validator: validateRequire }],
        password: [{ validator: validateRequire }],
        rptPassword: [{ validator: validateRequire }],
        brandId: [{ validator: validateRequire }]
      }
    }
  },
  created() {
    this.fetchBrandList()

    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }
  },
  methods: {
    fetchBrandList() {
      return fetchBrandList()
        .then(res => {
          this.brandListOptions = res.data.items.map(brand => {
            return {
              value: brand.id,
              label: brand.name
            }
          })
        })
    },
    fetchData(id) {
      // fetchArticle(id).then(response => {

      // }).catch(err => {
      //   console.log(err)
      // })
    },
    setTagsViewTitle() {
      const title = 'Edit Article'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    submitForm() {
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true

          createUser(this.postForm)
            .then(res => {
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.postForm.status = '已创建'
              this.loading = false

              this.$router.push('/user/list')
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    draftForm() {
      if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 1000
      })
      this.postForm.status = 'draft'
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea /deep/ {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
