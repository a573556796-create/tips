<template>
  <div class="hello">
      <div class="div1">
          <div class="total">
            <div class="div2">
              <div style="display: flex;align-items: center;margin-right: 10px;">
                <div>现金小费</div>：<el-input class="ipt" type="number" v-model="input" placeholder="现金小费"></el-input>
              </div>
              <div style="display: flex;align-items: center;margin-left: 10px;margin-right: 20px;">
                <div>信用卡小费</div>：<el-input class="ipt" type="number" v-model="input" placeholder="现金小费"></el-input>
              </div>
              <el-button type="primary">计算</el-button>
            </div>
            <div style="margin-top: 20px;margin-bottom: 20px;">
              计算前请先勾选需要计算的项目
            </div>
            <div class="line1">
                <div class="t1">
                  <div class="t2">3%</div>
                  <div class="t3"></div>
                </div>
                <div class="t1">
                  <div class="t2">总小费</div>
                  <div class="t3"></div>
                </div>
                <div class="t1">
                  <div class="t2">全职小费</div>
                  <div class="t3"></div>
                </div>
                <div class="t1">
                  <div class="t2">点数</div>
                  <div class="t3"></div>
                </div>
            </div>
            <div class="line1">
                <div class="t1" v-for="item in list1">
                  <div class="t2">
                    <div><img style="width: 15px;height: 15px;" src="../assets/selected1.png"></img></div>
                    <div>
                      <span>{{item.name}}</span>
                      <span class="dian">{{item.percent}}</span>
                    </div>
                  </div>
                  <div class="t3"></div>
                </div>
            </div>
            <div style="width: 100px;height: 30px;"></div>
            <div class="line11">
                <div class="t11" v-for="item in list2">
                  <div class="t4">
                    <div><img style="width: 15px;height: 15px;" src="../assets/selected1.png"></img></div>
                    <div>
                      <span>{{item.name}}</span>
                    </div>
                  </div>
                  <el-input  class="custom-input" style="width: 150px;" size="large" v-model="item.daily" placeholder="底薪/$"></el-input>
                  <el-input style="width: 150px;" v-model="item.ot" placeholder="加班/$"></el-input>
                  <el-input style="width: 150px;" v-model="item.wage" placeholder="工资/$"></el-input>
                </div>
                <div class="t11" v-for="item in list3">
                  <div class="t4">
                    <div><img style="width: 15px;height: 15px;" src="../assets/selected1.png"></img></div>
                    <div>
                      <span>{{item.name}}</span>
                      <span class="dian">17</span>
                    </div>
                  </div>
                  <el-input  class="custom-input" style="width: 150px;" size="large" v-model="input" placeholder="时长/Hours"></el-input>
                  <el-input style="width: 150px;" v-model="input" placeholder="加班/Hours"></el-input>
                  <el-input style="width: 150px;" v-model="input" placeholder="工资/$"></el-input>
                </div>
            </div>
          </div>
      </div>
      <el-button @click="open" type="primary">添加人员</el-button>
      <div class="add" v-if="!isClosed">
          <div class="add2">
            <div style="margin-top: 50px;font-size: 30px;margin-bottom: 20px;">添加工作人员</div>
            <el-select :popper-append-to-body="true" v-model="type" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.type"
                :label="item.label"
                :value="item.type">
              </el-option>
            </el-select>
            <div class="type1" v-if="type==1">
              <el-input style="width: 220px;margin-bottom: 10px;" v-model="type1Name" placeholder="请输入姓名"></el-input>
              <el-input type="number" style="width: 220px;" v-model="type1percent" placeholder="请输入点数"></el-input>
              <el-button @click="sub1" style="width: 220px;margin-top: 30px;" type="primary">提交</el-button>
              <el-button @click="close" style="width: 220px;margin-top: 30px;margin-left: -0px;" type="info">取消</el-button>
            </div>
            <div class="type1" v-if="type==2">
              <el-input style="width: 220px;margin-bottom: 10px;" v-model="type2Name" placeholder="请输入姓名"></el-input>
              <el-input  type="number" style="width: 220px;" v-model="type2daily" placeholder="请输入日薪"></el-input>
              <el-button style="width: 220px;margin-top: 30px;" type="primary">提交</el-button>
              <el-button  @click="close" style="width: 220px;margin-top: 30px;margin-left: -0px;" type="info">取消</el-button>
            </div>
            <div class="type1" v-if="type==3">
              <el-input style="width: 220px;margin-bottom: 10px;" v-model="type3Name" placeholder="请输入姓名"></el-input>
              <el-input  type="number" style="width: 220px;" v-model="type3hr" placeholder="请输入时薪"></el-input>
              <el-input  type="number" style="width: 220px;" v-model="type3hr2" placeholder="请输入加班时薪"></el-input>
              <el-button style="width: 220px;margin-top: 30px;" type="primary">提交</el-button>
              <el-button  @click="close" style="width: 220px;margin-top: 30px;margin-left: -0px;" type="info">取消</el-button>
            </div>
          </div>
      </div>
  </div>
</template>

<script>
export default {
  name: '',
  data () {
    return {
      isClosed: true,
      msg: '',
      checked: true,
      input:0,
      list1:[
        // {
        //   id:10001,
        //   type:1,
        //   name: 'Johnny',
        //   percent: 1,
        //   wage:0
        // },
        // {
        //   id:10002,
        //   type:1,
        //   name: 'Yiming',
        //   percent: 1,
        //   wage:0
        // },
        // {
        //   id:10003,
        //   type:1,
        //   name: '杨姐',
        //   percent: 0.9,
        //   wage:0
        // },
        // {
        //   id:10004,
        //   type:1,
        //   name: '吉祥',
        //   percent: 0.7,
        //   wage:0
        // }
      ],
      list2:[
        // {
        //   id:10010,
        //   type:2,
        //   name:'Astingna',
        //   daily:150,
        //   ot:0,
        //   wage:0
        // }
      ],
      list3:[
        // {
        //   id:10006,
        //   type:3,
        //   name: 'keyle',
        //   hr: 19,
        //   ot:0,
        //   wage:0
        // },
        // {
        //   id:10007,
        //   type:3,
        //   name: 'nicoo',
        //   hr: 18,
        //   ot:0,
        //   wage:0
        // },
        // {
        //   id:10008,
        //   type:3,
        //   name: 'ally',
        //   hr: 18,
        //   ot:0,
        //   wage:0
        // }
      ],
      options: [
        { type: 1, label: '全职' },
        { type: 2, label: '日薪' },
        { type: 3, label: '兼职' }
      ],
      type: 1,
      type1Name:'',
      type1percent: null,
      type2Name:'',
      type2daily: null,
      type3Name:'',
      type3hr: null,
      maxId: null
    }
  },
  mounted() {
    let list1 = localStorage.getItem('list1')!=null?JSON.parse(localStorage.getItem('list1')):[];
    let list2 = localStorage.getItem('list2')!=null?JSON.parse(localStorage.getItem('list2')):[];
    let list3 = localStorage.getItem('list3')!=null?JSON.parse(localStorage.getItem('list3')):[];
    let maxId
    if(list1.length==0&&list2.length==0&&list3.length==0){
      maxId=0
    }else{
      maxId = Math.max(
        ...list1.map(o => o.id),
        ...list2.map(o => o.id),
        ...list3.map(o => o.id)
      );
    }
    this.maxId = maxId
    console.log(maxId)
  },
  methods:{
    sub1(){
      if (!this.type1Name.trim()) {
        this.$message.error('用户名不能为空');
        return;
      }
      if (this.type1percent == null) {
        this.$message.error('点数不能为空');
        return;
      }
      let list1 = JSON.parse(localStorage.getItem('list1'));
      let obj = {}
      obj.id = this.maxId+1
      obj.name = this.type1Name
      obj.percent=this.type1percent
      if (list1) {
        list1.push(obj)
        this.list1 = list1
        localStorage.setItem('list1', JSON.stringify(list1));
        // try {
        //   this.list1 = JSON.parse(list1);
        // } catch (e) {
        //   console.error('解析失败:', e);
        // }
      }else{
        if(this.maxId==0){
          obj.id = 10001
        }else{
          obj.id = this.maxId + 1
        }
        let arr = []
        arr.push(obj)
        localStorage.setItem('list1', JSON.stringify(arr));
      }
    },
    open(){
      this.type = 1
      this.type1Name=''
      this.type1percent=null
      this.type2Name=''
      this.type2daily=null
      this.type3Name=''
      this.type3hr=null
      this.isClosed = false
    },
    close(){
      this.isClosed = true
    }
  }
}
</script>

<style scoped>
.type1{
  display: flex;
  flex-direction: column;
  margin-top: 30px;
}
.add2{
  width: 600px;
  height: 500px;
  background-color: white;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: visible;
}
.add{
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.div1{
  display:flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
}
.ipt{
  width:200px
}
.total{
  width: 1200px;
  display: flex;
  flex-direction: column;
}
.div2{
  display:flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.line1{
  display: flex;
  width: 1200px;
  flex-wrap: wrap;
}
.t1{
  display: flex;
  width: 300px;
  height: 50px;
}
.t2,.t3{
  width: 150px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.t2{
  background-color: #fafafa;
  border: 1px solid #dddee1;
  position: relative;
}
.t2 div{
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 5px;
  margin-right: 5px;
}
.t3{
  border: 1px solid #dddee1;
}
.dian{
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 7px;
  background-color: #1296db;
  right: 0;
  top: 0;
  color: white;
  font-size: 9px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.t4,.t5{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 250px;
  height: 50px;
}
.t4{
  background-color: #fafafa;
  border: 1px solid #dddee1;
  position: relative;
  width: 150px;
}
.t4 div{
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 5px;
  margin-right: 5px;
}
.t5{
  border: 1px solid #dddee1;
  justify-content: space-between;
  align-items: center;
}

.line11{
  display: flex;
  width: 1200px;
  min-height: 100px;
  justify-content: flex-start;
}
.t11{
  display: flex;
  width: 150px;
  height: 200px;
  flex-direction: column;
  box-sizing: border-box;
}
</style>
