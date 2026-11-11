<template>
  <div class="hello">
      <div class="div1">
          <div class="total">
            <div class="div2">
              <div style="display: flex;align-items: center;margin-right: 10px;">
                <div>现金小费</div>：<el-input class="ipt" type="number" v-model="cash" placeholder="请输入现金小费"></el-input>
              </div>
              <div style="display: flex;align-items: center;margin-left: 10px;margin-right: 20px;">
                <div>信用卡小费</div>：<el-input class="ipt" type="number" v-model="credit" placeholder="请输入信用卡小费"></el-input>
              </div>
              <el-button @click=count() type="success">计算工资</el-button>
              <el-button @click=clear() type="info">清空数据</el-button>
            </div>
            <div style="margin-top: 20px;margin-bottom: 20px;">
              计算前请先勾选需要计算的人员
            </div>
            <div class="line1">
                <div class="t1">
                  <div class="t2">3%</div>
                  <div class="t3">{{percent3}}</div>
                </div>
                <div class="t1">
                  <div class="t2">总小费</div>
                  <div class="t3">{{totalTips1}}</div>
                </div>
                <div class="t1">
                  <div class="t2">全职小费</div>
                  <div class="t3">{{totalTips2}}</div>
                </div>
                <div class="t1">
                  <div class="t2">点数</div>
                  <div class="t3">{{totalPercent}}</div>
                </div>
            </div>
            <div class="line1">
                <div class="t1" v-for="(item,index) in list1" v-if="item.isShow==1">
                  <div class="t2" @click=selected1(index)>
                    <div>
                      <img style="width: 15px;height: 15px;" v-if="item.isSelected" src="../assets/selected1.png"></img>
                      <img style="width: 15px;height: 15px;" v-if="!item.isSelected" src="../assets/selected2.png"></img>
                    </div>
                    <div>
                      <span>{{item.name}}</span>
                      <span v-if="item.isSelected" class="dian">{{item.percent}}</span>
                      <span v-if="!item.isSelected" class="dian2">{{item.percent}}</span>
                    </div>
                  </div>
                  <div class="t3"><el-input v-model="item.wage">{{item.wage}}</el-input></div>
                </div>
            </div>
            <div style="width: 100px;height: 30px;"></div>
            <div class="line11">
                <div class="t11" v-for="(item,index) in list2" :key="item.id" v-if="item.isShow==1">
                  <div class="t4" @click=selected2(index)>
                    <div>
                      <img style="width: 15px;height: 15px;" v-if="item.isSelected" src="../assets/selected1.png"></img>
                      <img style="width: 15px;height: 15px;" v-if="!item.isSelected" src="../assets/selected2.png"></img>
                    </div>
                    <div>
                      <span>{{item.name}}</span>
                    </div>
                  </div>
                  <el-input  class="custom-input" style="width: 150px;" size="large" v-model="item.daily" placeholder="底薪/$"></el-input>
                  <el-input style="width: 150px;" v-model="item.ot" placeholder="加班费/$"></el-input>
                  <el-input style="width: 150px;" @change="changewage2(index)" v-model="item.wage" placeholder="工资/$"></el-input>
                </div>
                <div class="t11" v-for="(item,index) in list3" v-if="item.isShow==1">
                  <div class="t4" @click=selected3(index)>
                    <div>
                      <img style="width: 15px;height: 15px;" v-if="item.isSelected" src="../assets/selected1.png"></img>
                      <img style="width: 15px;height: 15px;" v-if="!item.isSelected" src="../assets/selected2.png"></img>
                    </div>
                    <div>
                      <span>{{item.name}}</span>
                      <span v-if="item.isSelected" class="dian">{{item.hr}}</span>
                      <span v-if="!item.isSelected" class="dian2">{{item.hr}}</span>
                    </div>
                  </div>
                  <el-input  class="custom-input" style="width: 150px;" size="large" v-model="item.time1" placeholder="工作时长/Hours"></el-input>
                  <el-input style="width: 150px;" v-model="item.time2" placeholder="加班时长/Hours"></el-input>
                  <el-input style="width: 150px;" @change="changewage3(index)" v-model="item.wage" placeholder="工资/$"></el-input>
                </div>
            </div>
          </div>
      </div>
      
      <div class="add" v-if="!isClosed">
          <div class="add2">
            <div v-if="!isEdit" style="margin-top: 50px;font-size: 30px;margin-bottom: 20px;">添加工作人员</div>
            <div v-if="isEdit" style="margin-top: 50px;font-size: 30px;margin-bottom: 20px;">编辑工作人员</div>
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
              <el-button @click="close" style="width: 220px;margin-top: 30px;margin-left: -0px;" type="info">关闭</el-button>
            </div>
            <div class="type1" v-if="type==2">
              <el-input style="width: 220px;margin-bottom: 10px;" v-model="type2Name" placeholder="请输入姓名"></el-input>
              <el-input  type="number" style="width: 220px;" v-model="type2daily" placeholder="请输入日薪"></el-input>
              <el-button @click="sub2" style="width: 220px;margin-top: 30px;" type="primary">提交</el-button>
              <el-button  @click="close" style="width: 220px;margin-top: 30px;margin-left: -0px;" type="info">关闭</el-button>
            </div>
            <div class="type1" v-if="type==3">
              <el-input style="width: 220px;margin-bottom: 10px;" v-model="type3Name" placeholder="请输入姓名"></el-input>
              <el-input  type="number" style="width: 220px;margin-bottom: 10px;" v-model="type3hr" placeholder="请输入时薪"></el-input>
              <el-input  type="number" style="width: 220px;" v-model="type3hr2" placeholder="请输入加班时薪"></el-input>
              <el-input  type="number" style="width: 220px;margin-bottom: 10px;margin-top: 10px;" v-model="type3hr3" placeholder="请输入公司补助"></el-input>
              <el-button @click="sub3" style="width: 220px;margin-top: 30px;" type="primary">提交</el-button>
              <el-button  @click="close" style="width: 220px;margin-top: 30px;margin-left: -0px;" type="info">关闭</el-button>
            </div>
          </div>
      </div>
      <div class="add3" @click=test() v-if="listShow">
          <div class="add4" @click=test2()>
            <div style="position: absolute;right: 50px;top: 20px;">
              <el-button @click="open" type="primary">添加人员</el-button>
            </div>
            <div style="font-size: 25px;margin-top: 20px;margin-bottom: 20px;">员工列表</div>
            <div class="add5">
               <div class="listItem">
                 <div style="width:80px">首页显示</div>
                 <div style="width:140px">姓名</div>
                 <div style="width:100px">编辑员工</div>
                 <div style="width:100px">删除员工</div>
               </div>
               <div class="listItem" v-for="(item,index) in list1">
                 <div style="width:80px"><el-checkbox  v-model="item.isShow" :true-label="1" :false-label="0"   @change="show1()"></el-checkbox></div>
                 <div style="width:140px">{{item.name}}</div>
                 <div @click="edit(1,index,item.id)" style="width:100px;color: #409EFF;">编辑</div>
                 <div style="width:100px;color: #409EFF;" @click=delete1(1,index)>删除</div>
               </div>
               <div class="listItem" v-for="(item,index) in list2">
                 <div style="width:80px"><el-checkbox  v-model="item.isShow" :true-label="1" :false-label="0" @change="show2()"></el-checkbox></div>
                 <div style="width:140px">{{item.name}}</div>
                 <div @click="edit(2,index,item.id)" style="width:100px;color: #409EFF;">编辑</div>
                 <div style="width:100px;color: #409EFF;" @click=delete2(2,index)>删除</div>
               </div>
               <div class="listItem" v-for="(item,index) in list3">
                 <div style="width:80px"><el-checkbox  v-model="item.isShow" :true-label="1" :false-label="0" @change="show3()"></el-checkbox></div>
                 <div style="width:140px">{{item.name}}</div>
                 <div @click="edit(3,index,item.id)" style="width:100px;color: #409EFF;">编辑</div>
                 <div style="width:100px;color: #409EFF;" @click=delete3(3,index)>删除</div>
               </div>
            </div>
          </div>
      </div>
      <el-input v-model="date2" placeholder="请输入日期"></el-input>
      <el-button @click="listshow" type="success">员工列表</el-button>
      <el-button type="success" @click="saveToHistory">保存今日记录</el-button>
      <el-button type="success" @click="tongji">统计</el-button>
      <el-button type="success" :disabled="isPlus20" @click="plus20">16000加20</el-button>
      <el-button type="success" :disabled="isPlus30" @click="plus30">20000加30</el-button>
      <div class="add"  @click=test() v-if="tongjiShow">
          <div style="width:400px;height: 500px;background-color: white;border-radius: 10px;position: relative;"  @click=test2()>
              <div style="width: 400px;">
                <!-- <div style="margin-bottom:8px;">
            <el-select v-model="selectedStaffId" placeholder="请选择工作人员">
      
      <el-option
        v-for="item in staffList"
        :key="item.id"           :label="item.name"       :value="item.id"         />
    </el-select>
      <el-checkbox style="position: absolute;top: 25px;left: 150px;z-index: 99999;" v-model="isChecked" @change="changeMode">统计模式</el-checkbox>
    </div> -->
                <el-calendar 
                    :model-value="calendarValue"
                    @input="onSelectDay"
                  >
                    <template v-slot:dateCell="{ date, data }">
                      <div 
                        class="date-cell-content"
                        :class="{
                          'future-date-gray': isFutureDate(date),
                          'range-start': isStart(date),
                          'range-end': isEnd(date),
                          'range-middle': isInRange(date)
                        }"
                        @click="selectRange(date)"
                      >
                        {{ date.getUTCDate() }}
                      </div>
                    </template>
                  </el-calendar>
                  <div class="result">
                      <div class="r1">
                        <div style="margin-right: 5px" v-for="item in singleResult" v-if="item.type==1">{{item.name}}:{{item.wage}}</div>
                      </div>
                      <div class="r1">
                        <div style="margin-right: 5px" v-for="item in singleResult" v-if="item.type==2">{{item.name}}:{{item.wage}}</div>
                        <div style="margin-right: 5px" v-for="item in singleResult" v-if="item.type==3">{{item.name}}:{{item.wage}}({{item.time1}}h<span v-if="item.time2">+{{item.time2}}h</span>)</div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
export default {
  name: '',
  data () {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    today.setUTCHours(0,0,0,0);
    return {
      date2:'',
      selectedStaffId: null, 
      // 2. 工作人员列表数据，这是一个包含对象（工作人员信息）的数组
      staffList:[
        { id: 101, name: '张三', department: '研发部' },
        { id: 102, name: '李四', department: '市场部' },
        { id: 103, name: '王五', department: '财务部' },
        { id: 104, name: '赵六', department: '人事部' }
      ],
      singleResult: [],
      selectedDate:'',
      todayLocalTimestamp: today.getTime(),
      isPlus20:false,
      isPlus30:false,
      tongjiShow:false,
      isChecked:false,
      calendarValue: new Date(),
      startDate: null,
      endDate: null,
      value: '',
      todayUtcTimestamp: today.getTime(),
      cash:'',
      credit:'',
      totalTips1:null,
      totalTips2:null,
      percent3:null,
      isEdit: false,
      isEditId:null,
      isClosed: true,
      listShow: false,
      msg: '',
      checked: true,
      input:0,
      totalPercent:null,
      list1:[],
      list2:[],
      list3:[],
      list22:[],
      list33:[],
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
      type3hr2:null,
      type3hr3:null,
      maxId: null,
      currentList: null,
      currentIndex:null,
      currentId:null,
      isCount:false,
      startTime:null,
      endTime:null
    }
  },
  mounted() {
    this.getHistory()
    this.getUsers()
    this.getMax()
    this.getList()
  },
  computed: {
    currentDisplayMonth() {
      if (this.calendarValue instanceof Date) {
      // 建议使用 UTC 方法获取年和月，以避免时区偏移导致的日期提前
      const year = this.calendarValue.getUTCFullYear();
      // getUTCMonth() 返回 0-11，需要 +1
      const month = this.calendarValue.getUTCMonth() + 1; 
      
      // 如果您需要本地时间显示，但 calendarValue 确实被时区影响了，
      // 那么使用 UTC 往往能锁定到该日期对象代表的那个“月”。
      return `${year}年${month}月`; 
    }
    return '无法获取月份';
    }
  },
  methods:{
    getUsers() {
      this.$http.get('/list')
        .then(res => {
          let result = res.data
          localStorage.setItem('list1', JSON.stringify(result.list1))
          localStorage.setItem('list2', JSON.stringify(res.data.list2))
          localStorage.setItem('list3', JSON.stringify(res.data.list3))
        })
        .catch(error => {
          console.error('请求失败:', error)
        })
    },
    clear(){
      this.credit=''
      this.cash=''
    },
    plus20(){
      if(!this.isCount){
        this.$message.error('计算后再加20');
        return false
      }
      if(this.isPlus20){
        return false
      }
      let sum2 = 0
      let sum3 = 0
      this.list2.map(res=>{
        if(res.isSelected){
          res.wage = (Number(res.wage)+20)
        }
      })
      this.list3.map(res=>{
        if(res.isSelected){
          res.wage = (Number(res.wage)+20)
        }
      })
      this.list2.map(res=>{
        if(res.isSelected){
          sum2 += (Number(res.wage)+20) || 0; 
        }
      })
      this.list3.map(res=>{
        if(res.isSelected){
          sum3 += (Number(res.wage)+20) || 0; 
        }
      })
      this.totalTips2 = Number(this.totalTips1 - sum2 - sum3);

      // 4. 重新分配给 List1
      let list11 = this.list1.filter(item => item.isSelected);
      console.log(list11)
      this.splitFairForObjects(list11, this.totalTips2);

      // 5. 强制刷新视图 (Vue 2 有时需要)
      this.isPlus20=true
      this.$forceUpdate();
    },
    plus30(){
      if(!this.isCount){
        this.$message.error('计算后再加30');
        return false
      }
      if(this.isPlus30){
        return false
      }
      let sum2 = 0
      let sum3 = 0
      this.list2.map(res=>{
        if(res.isSelected){
          res.wage = (Number(res.wage)+30)
        }
      })
      this.list3.map(res=>{
        if(res.isSelected){
          res.wage = (Number(res.wage)+30)
        }
      })
      this.list2.map(res=>{
        if(res.isSelected){
          sum2 += (Number(res.wage)+30) || 0; 
        }
      })
      this.list3.map(res=>{
        if(res.isSelected){
          sum3 += (Number(res.wage)+30) || 0; 
        }
      })
      this.totalTips2 = Number(this.totalTips1 - sum2 - sum3);

      // 4. 重新分配给 List1
      let list11 = this.list1.filter(item => item.isSelected);
      this.splitFairForObjects(list11, this.totalTips2);

      // 5. 强制刷新视图 (Vue 2 有时需要)
      this.$forceUpdate();
      this.isPlus30=true
    },
    tongji(){
      this.tongjiShow=true
    },
    changeMode(){
      this.startDate = null;
      this.endDate = null;
    },
    formatDate(date) {
      // 解决跨时区 (如纽约时区) 导致日期偏差的问题
      const year = date.getUTCFullYear();
      // getUTCMonth() 返回 0-11，需要 +1
      const month = String(date.getUTCMonth() + 1).padStart(2, '0'); 
      const day = String(date.getUTCDate()).padStart(2, '0'); 
      return `${year}-${month}-${day}`;
    },
    single(date){
      let getSalary = JSON.parse(localStorage.getItem('wage_history'));
      this.singleResult =  getSalary.filter(item => item.date == date);
      console.log(this.singleResult)
    },
    toLocalDate(str) {
        const [y, m, d] = str.split('-').map(Number);
        return new Date(y, m - 1, d);
    },
    selectRange(date) {
        // 检查是否是单选模式 (this.isChecked 为 false)

        if(!this.isChecked){
            this.selectedDate = this.formatDate(date);
            this.single(this.selectedDate);
            
            // 关键改动：使用 formatDate 打印，确保看到的是选择的日期
            console.log('点击了日期：', this.selectedDate); 
            return false;
        }

        if (this.isFutureDate(date)) return;

        const current = this.toLocalDate(this.formatDate(date));
        if (!this.startDate) {
            this.startDate = current;
            this.startTime=this.formatDate(this.startDate)
            console.log('开始了',this.startTime);
            return;
        }

        // ② 如果已经有 start 但没有 end → 设置 end
        if (this.startDate && !this.endDate) {
            const start = this.startDate.getTime();
            const end = date.getTime();

            // 若结束比开始早 → 交换
            if (end < start) {
                this.endDate = this.startDate;
                this.startDate = new Date(date);
            } else {
                this.endDate = new Date(date);
            }
            
            // 关键改动：使用 formatDate 打印，避免时区问题
            // 注意：原代码中打印的是 this.end，假设是 this.endDate 的笔误，这里修正为 this.endDate
            this.endTime=this.formatDate(this.endDate)
            console.log('结束了', this.startTime,this.endTime);
            // 如果原代码中 this.end 是一个存在的属性，请自行调整
            // console.log('结束了', this.end); 
            return;
        }

        // ③ start + end 都存在，再点击就是重新开始
        this.startDate = new Date(date);
        this.endDate = null;
        
        // 关键改动：重新开始时也打印格式化后的日期
        console.log('重新开始，新选择了',this.formatDate(this.startDate));
    },
  onSelectDay(e) {
    this.calendarValue = e;
  },

  // -------------------------
  // 高亮逻辑
  // -------------------------
  isSameDay(a, b) {
    if (!a || !b) return false;
    return (
      a.getUTCFullYear() === b.getUTCFullYear() &&
      a.getUTCMonth() === b.getUTCMonth() &&
      a.getUTCDate() === b.getUTCDate()
    );
  },

  isStart(date) {
    return this.isSameDay(date, this.startDate);
  },

  isEnd(date) {
    return this.isSameDay(date, this.endDate);
  },

  isInRange(date) {
    if (!this.startDate || !this.endDate) return false;

    const t = date.getTime();
    const s = this.startDate.getTime();
    const e = this.endDate.getTime();

    return t > s && t < e;
  },
    isFutureDate(date) {
      // 用 UTC 判断
      const d = new Date(date);
      d.setUTCHours(0,0,0,0);
      return d.getTime() > this.todayUtcTimestamp;
    },
    disableFutureDates(time) {
      return time.getTime() > this.todayTimestamp;
    },
    onSelect(date) {
      const y = date.getUTCFullYear();
      const m = String(date.getUTCMonth() + 1).padStart(2, '0');
      const d = String(date.getUTCDate()).padStart(2, '0');
      const ymd = `${y}-${m}-${d}`;
      this.value = ymd;   // 或者 this.$emit(...)
      console.log(ymd);
    },
    changewage2(index){
      if(this.isCount){
         this.recalculateList1();
      }
    },
    changewage3(index){
      if(this.isCount){
         this.recalculateList1();
      }
    },
    recalculateList1() {
      // 如果还没点击过“计算”按钮，就不执行，防止报错
      if (!this.isCount) return;

      // 1. 重新统计 list2 (日薪) 的当前工资总和
      let sum2 = 0;
      this.list2.forEach(item => {
        // 只有勾选参与计算的才统计
        if (item.isSelected) {
          // 注意：这里直接取 item.wage，也就是你手动修改后的值
          sum2 += Number(item.wage) || 0; 
        }
      });

      // 2. 重新统计 list3 (兼职) 的当前工资总和
      let sum3 = 0;
      this.list3.forEach(item => {
        if (item.isSelected) {
          sum3 += Number(item.wage) || 0;
        }
      });

      // 3. 计算剩下的钱 (全职小费池)
      // totalTips1 是 (现金+信用卡 - 3%)，这个是大池子，通常不变
      this.totalTips2 = Number(this.totalTips1 - sum2 - sum3);

      // 4. 重新分配给 List1
      let list11 = this.list1.filter(item => item.isSelected);
      this.splitFairForObjects(list11, this.totalTips2);

      // 5. 强制刷新视图 (Vue 2 有时需要)
      this.$forceUpdate();
    },
    show1(){
      localStorage.setItem('list1', JSON.stringify(this.list1))
      this.getList()
    },
    show2(){
      localStorage.setItem('list2', JSON.stringify(this.list2))
      this.getList()
    },
    show3(){
      localStorage.setItem('list3', JSON.stringify(this.list3))
      this.getList()
    },
    count(){
      this.isPlus20=false
      this.isPlus30=false
      if(this.cash==''){
        this.$message.error('现金不能为空');
        return false
      }
      if(this.credit==''){
        this.$message.error('信用卡不能为空');
        return false
      }
      this.isCount = true
      this.percent3 = Math.round((Number(this.cash) + Number(this.credit))*0.03)
      this.totalTips1 = (Number(this.cash) + Number(this.credit))-this.percent3
      let sum1 = 0
      let sum2 = 0
      this.list2.map(res=>{
        if(res.isSelected){
          res.wage = Number(res.daily)+Number(res.ot?res.ot:0)
          sum1 += res.wage
        }
      })
      this.list3.map(res=>{
        if(res.isSelected){
          res.wage = Math.round(Number((Number(res.hr)-Number(res.buzhu))*Number(res.time1))+Number(Number(res.ot)*Number(res.time2?res.time2:0)))
          sum2 += res.wage
        }
      })
      this.totalTips2 = Number(this.totalTips1-sum1-sum2)
      let list11 = this.list1.filter(item => item.isSelected);
      console.log(list11)
      this.splitFairForObjects(list11, this.totalTips2)
      this.$forceUpdate()
    },
    selected1(index){
      //this.$set(this.list1, index, {...this.list1[index],isSelected:!this.list1[index].isSelected})
      this.list1[index].isSelected = !this.list1[index].isSelected
      let sum = 0
      this.list1.map(res=>{
        if(res.isSelected){
          sum += Number(res.percent)
        }
      })
      this.totalPercent = sum.toFixed(1)
      this.$forceUpdate()
    },
    selected2(index){
      console.log(this.list1[index].isSelected)
      //this.$set(this.list1, index, {...this.list1[index],isSelected:!this.list1[index].isSelected})
      this.list2[index].isSelected = !this.list2[index].isSelected
      this.$forceUpdate()
    },
    selected3(index){
      this.list3[index].isSelected = !this.list3[index].isSelected
      this.$forceUpdate()
    },
    test(){
      this.listShow = false
      this.tongjiShow=false
      this.selectedDate=''
      this.singleResult=[]
    },
    test2(){
      event.stopPropagation();
    },
    listshow(){
      this.listShow = true
    },
    delete1(zindex,index){
      this.$confirm('确定删除此员工?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.list1.splice(index,1)
            localStorage.setItem('list1', JSON.stringify(this.list1));
            this.update()
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        })
    },
    delete2(zindex,index){
      this.$confirm('确定删除此员工?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.list2.splice(index,1)
          localStorage.setItem('list2', JSON.stringify(this.list2));
          this.update()
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        })
      
    },
    delete3(zindex,index){
      this.$confirm('确定删除此员工?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.list3.splice(index,1)
          localStorage.setItem('list3', JSON.stringify(this.list3));
          this.update()
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        })
    },
    edit(zindex,index,id){
      this.isClosed = false
      this.isEdit = true
      this.type = this.currentList = zindex
      this.currentIndex = index
      if(zindex==1){
        this.type1Name=this.type2Name=this.type3Name=this.list1[index].name
        this.currentId=this.list1[this.currentIndex].id
        this.type1percent = this.list1[this.currentIndex].percent
      }
      if(zindex==2){
        this.type1Name=this.type2Name=this.type3Name=this.list2[index].name
        this.currentId=this.list2[this.currentIndex].id
        this.type2daily=this.list2[this.currentIndex].daily
      }
      if(zindex==3){
        this.type1Name=this.type2Name=this.type3Name=this.list3[index].name
        this.currentId=this.list3[this.currentIndex].id
        this.type3hr=this.list3[this.currentIndex].hr
        this.type3hr2=this.list3[this.currentIndex].ot
        this.type3hr3=this.list3[this.currentIndex].buzhu
      }
      this.getList()
    },
    splitFairForObjects(list, totalMoneyRaw) {
    const totalMoney = Number(totalMoneyRaw);
    let history = JSON.parse(localStorage.getItem('wage_history')) || [];
    if (!isFinite(totalMoney) || totalMoney < 0) return list;

    // 1. 精度转换（确保 1.00 和 1 比较时是相等的）
    const decimals = list.map(it => (String(it.percent || '').split('.')[1] || '').length);
    const scale = Math.pow(10, Math.max(...decimals));
    const finalScale = scale * 1000;

    const scaled = list.map((item, idx) => {
        const p = Number(item.percent);
        const pScaled = isFinite(p) ? Math.round(p * finalScale) : 0;
        return { __origIndex: idx, pScaled, item };
    });

    const totalScaled = scaled.reduce((s, x) => s + x.pScaled, 0);
    if (totalScaled === 0) return list;

    // 2. 基础分配
    scaled.forEach(x => {
        const numerator = totalMoney * x.pScaled;
        x.intPart = Math.floor(numerator / totalScaled);
        x.rem = numerator % totalScaled;
    });

    let remain = totalMoney - scaled.reduce((s, x) => s + x.intPart, 0);

    // =====================================================
    // ★ 核心：查找两人最近一次的工资差额 ★
    // =====================================================
    const getHistoryBias = (userA, userB) => {
        // 先按日期分组
        const groups = {};
        history.forEach(rec => {
            if (!groups[rec.date]) groups[rec.date] = [];
            groups[rec.date].push(rec);
        });

        // 按日期从新到旧排序
        const sortedDates = Object.keys(groups).sort((a, b) => new Date(b) - new Date(a));

        for (let date of sortedDates) {
            const dayRecords = groups[date];
            const recA = dayRecords.find(r => r.userId === userA.userId);
            const recB = dayRecords.find(r => r.userId === userB.userId);

            // 只有当两人都在，且工资【不相等】时才有参考价值
            if (recA && recB) {
                const wA = Number(recA.wage || 0);
                const wB = Number(recB.wage || 0);
                if (wA !== wB) {
                    return wA - wB; // A比B多，返回正数
                }
            }
        }
        return 0;
    };

    // =====================================================
    // ★ 核心：重新定义排序优先级 ★
    // =====================================================
    const rank = scaled.slice().sort((a, b) => {
        // 第一优先级：点数（percent）
        // 点数高的必须先拿钱
        if (a.pScaled !== b.pScaled) {
            return b.pScaled - a.pScaled; 
        }

        // 第二优先级：历史平衡
        // 如果点数完全一样，看历史谁拿得多
        const bias = getHistoryBias(a.item, b.item);
        if (bias !== 0) {
            // 如果 bias > 0 (A上次多)，返回正数让 A 往后排，B 往前排
            return bias; 
        }

        // 第三优先级：数学余数
        if (b.rem !== a.rem) {
            return b.rem - a.rem;
        }

        return a.__origIndex - b.__origIndex;
    });

    // 3. 分配多出来的钱
    rank.slice(0, remain).forEach(x => {
        x.intPart += 1;
    });

    // 4. 写回结果
    scaled.forEach(x => {
        const idx = x.__origIndex;
        list[idx].wage = x.intPart;
        list[idx].wage2 = x.intPart;
    });

    console.log("历史修正后的分配列表：", list);
    return list;
},
  //   splitFairForObjects(list, totalMoneyRaw) {
  //       const totalMoney = Number(totalMoneyRaw);
  //       if (!isFinite(totalMoney) || totalMoney < 0) return list;

  //       // ---- 确保 benefit 存在且为数字 ----
  //       list.forEach(x => {
  //         const b = Number(x.benefit);
  //         x.benefit = isFinite(b) ? b : 0;
  //       });

  //       // ---- 找到 percent 的小数精度 ----
  //       const decimals = list.map(it => {
  //         const s = String(it.percent || '');
  //         const m = (s.split('.')[1] || '').length;
  //         return isFinite(m) ? m : 0;
  //       });
  //       const scale = Math.pow(10, Math.max(...decimals));
  //       const finalScale = scale * 1000;

  //       // ---- 构造 scaled ----
  //       const scaled = list.map((item, idx) => {
  //         const p = Number(item.percent);
  //         const pScaled = isFinite(p) ? Math.round(p * finalScale) : 0;
  //         return { __origIndex: idx, pScaled, item };
  //       });

  //       const totalScaled = scaled.reduce((s, x) => s + x.pScaled, 0);
  //       if (totalScaled === 0) return list;

  //       // ---- 基础分配 ----
  //       scaled.forEach(x => {
  //         const numerator = totalMoney * x.pScaled;
  //         x.intPart = Math.floor(numerator / totalScaled);
  //         x.rem = numerator % totalScaled;
  //       });

  //       let allocated = scaled.reduce((s, x) => s + x.intPart, 0);
  //       let remain = totalMoney - allocated;
  //       if (remain < 0) remain = 0;

  //       // =====================================================
  //       //  ★★ 余数分配逻辑：按 benefit 小的优先补偿 ★★
  //       // =====================================================

  //       // 排序规则：
  //       // 1. benefit 小 → 优先
  //       // 2. benefit 相同 → remainder 大 → 优先
  //       // 3. 最后按原始顺序
  //       const rank = scaled.slice().sort((a, b) => {
  //         if (a.item.benefit !== b.item.benefit) {
  //           return a.item.benefit - b.item.benefit;
  //         }
  //         if (a.rem !== b.rem) {
  //           return b.rem - a.rem;
  //         }
  //         return a.__origIndex - b.__origIndex;
  //       });

  //       // 给前 remain 个补偿
  //       rank.slice(0, remain).forEach(x => {
  //         x.intPart += 1;        // 多拿 1 元
  //         x.item.benefit += 1;   // benefit 累加
  //       });

  //       // =====================================================
  //       //             ★ 写回 wage ★
  //       // =====================================================
  //       scaled.forEach(x => {
  //         const idx = x.__origIndex;
  //         list[idx].wage2=list[idx].wage = x.intPart;
  //       });

  //       console.log("分配结果：", list);
  //       return list;
  // },
    //每次都一样
//     splitFairForObjects(list, totalMoneyRaw) {
//   const totalMoney = Number(totalMoneyRaw);
//   if (!isFinite(totalMoney) || totalMoney < 0) return list;

//   // ---- 1. 按 percent 分组 ----
//   const groups = {}; 
//   list.forEach((item, index) => {
//     const p = Number(item.percent);
//     if (!isFinite(p)) return;
//     if (!groups[p]) groups[p] = [];
//     groups[p].push(index);
//   });

//   // ---- 2. 计算每个组的权重（percent × 人数）----
//   const groupInfos = Object.entries(groups).map(([pStr, idxArr]) => {
//     const p = Number(pStr);
//     return {
//       percent: p,
//       indexes: idxArr,
//       weight: p * idxArr.length   // 组权重 = 组人数 × percent
//     };
//   });

//   const totalWeight = groupInfos.reduce((s, g) => s + g.weight, 0);
//   if (totalWeight === 0) return list;

//   // ---- 3. 按组分配金额 (整数) ----
//   let remaining = totalMoney;

//   groupInfos.forEach(g => {
//     const numerator = totalMoney * g.weight;
//     g.money = Math.floor(numerator / totalWeight);  // 该组总金额
//     remaining -= g.money;
//   });

//   // ---- 4. 把剩余的钱按组权重从大到小继续分配 ----
//   groupInfos
//     .sort((a, b) => b.weight - a.weight)
//     .slice(0, remaining)
//     .forEach(g => g.money++);

//   // ---- 5. 把组内金额平均给每个人 ----
//   groupInfos.forEach(g => {
//     const each = Math.floor(g.money / g.indexes.length);
//     g.indexes.forEach(i => {
//       list[i].wage = each;
//     });
//   });

//   return list;
// },

  //    splitFairForObjects(list, totalMoneyRaw) {
  //   // 1. 转数字并校验
  //   const totalMoney = Number(totalMoneyRaw);
  //   if (!isFinite(totalMoney) || totalMoney < 0) {
  //     console.error('totalMoney must be a non-negative number', totalMoneyRaw);
  //     return list;
  //   }

  //   // 2. 决定 scale：根据 percents 中最大的十进制位数来放大为整数
  //   const decimals = list.map(it => {
  //     const s = String(it.percent === undefined ? '' : it.percent);
  //     const m = (s.split('.')[1] || '').length;
  //     return isFinite(m) ? m : 0;
  //   });
  //   const maxDec = Math.max(0, ...decimals);
  //   const scale = Math.pow(10, maxDec); // e.g. percent 0.9 => scale 10, 0.75 => 100

  //   // 为了更保险（把1变成1000而不是1），我们再把 scale 再乘以 10 或 1000 以避免太小的总Scaled值
  //   // 但不能太大以致溢出；这行可按需调整。下面采用 *1000 以得到较精细的整数比例（常用）。
  //   const finalScale = scale * 1000;

  //   // 3. 计算 scaled percents（整数）
  //   const scaled = list.map((item, idx) => {
  //     const p = Number(item.percent);
  //     const pScaled = isFinite(p) ? Math.round(p * finalScale) : 0;
  //     return { __origIndex: idx, pScaled, item };
  //   });

  //   const totalScaled = scaled.reduce((s, x) => s + x.pScaled, 0);
  //   if (totalScaled === 0) {
  //     console.error('total percent scaled is zero');
  //     return list;
  //   }

  //   // 4. 用整数算每人的整数份额与余数（以 totalScaled 为模）
  //   //    numerator = totalMoney * pScaled
  //   scaled.forEach(x => {
  //     const numerator = totalMoney * x.pScaled; // 整数乘法
  //     x.intPart = Math.floor(numerator / totalScaled); // 整数部分
  //     x.rem = numerator % totalScaled; // 余数（用于比较谁优先拿剩下的）
  //   });

  //   // 5. 计算已分配与剩余（用整数）
  //   const allocated = scaled.reduce((s, x) => s + x.intPart, 0);
  //   let remain = totalMoney - allocated;
  //   if (remain < 0) remain = 0;

  //   // 6. 按余数从大到小分配剩余；余数相等时按原数组索引升序（确定性）
  //   scaled
  //     .slice()
  //     .sort((a, b) => {
  //       if (b.rem !== a.rem) return b.rem - a.rem;
  //       return a.__origIndex - b.__origIndex;
  //     })
  //     .slice(0, remain)
  //     .forEach(x => x.intPart += 1);

  //   // 7. 写回 wage 字段（使用 Vue.set 保证响应式），并清理临时字段
  //   scaled.forEach(x => {
  //     const idx = x.__origIndex;
  //     this.$set(list[idx], 'wage', x.intPart);
  //     // 可选：删除临时字段
  //     delete x.intPart;
  //     delete x.rem;
  //     delete x.__origIndex;
  //   });
  //   return list;
  // },
    getList(){
        let list1 = localStorage.getItem('list1')!=null?JSON.parse(localStorage.getItem('list1')):[];
        let list2 = localStorage.getItem('list2')!=null?JSON.parse(localStorage.getItem('list2')):[];
        let list3 = localStorage.getItem('list3')!=null?JSON.parse(localStorage.getItem('list3')):[];
        
        // --- 修改开始：处理 list2，确保 wage 和 ot 存在且响应式 ---
        this.list2 = list2.map(item => ({
          ...item,
          isSelected: true, // 原有逻辑
          wage: item.wage || '', // 强制初始化 wage
          ot: item.ot || ''      // 强制初始化 ot
        }));
        // --- 修改结束 ---

        // --- 修改开始：处理 list3，同理 ---
        this.list3 = list3.map(item => ({
          ...item,
          isSelected: false, // 原有逻辑
          wage: item.wage || '',
          time1: item.time1 || '',
          time2: item.time2 || ''
        }));
        // --- 修改结束 ---

        this.list1 = list1;
        let sum1 = 0;
        this.list1.forEach(item => {
          item.isSelected = true;
          if (item.isSelected && item.isShow) {
            sum1 += Number(item.percent);
          }
        });
        this.totalPercent = sum1.toFixed(1);
    },
    getTodayString() {
      const date = new Date();
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
  // 保存今日工资到历史记录
   normalizeRecord(r) {
      return {
        date: r.date || null,

        userId:
          (r.userId !== undefined && r.userId !== null) ? r.userId :
          (r.user_id !== undefined && r.user_id !== null) ? r.user_id :
          (r.id !== undefined && r.id !== null) ? r.id :
          null,

        name: r.name || null,
        type: Number(r.type) || null,
        wage: Number(r.wage) || 0,

        percent: r.percent || null,
        benefit: r.benefit || null,
        daily: r.daily || null,
        ot: r.ot || null,

        hr: r.hr || null,
        time1: r.time1 || null,
        time2: r.time2 || null,
        buzhu: r.buzhu || null
      };
  },
  getHistory() {
    this.$http.get('/getHistory')
      .then(res => {
        const backendRecords = res.data || [];

        // 转成统一格式
        const normalized = backendRecords.map(r => this.normalizeRecord(r));

        // 保存到 localStorage
        localStorage.setItem('wage_history', JSON.stringify(normalized));

        //this.$message.success(`后台数据已全部保存到本地，共 ${normalized.length} 条记录`);
      })
      .catch(err => {
        this.$message.error("后台数据获取失败");
        console.error(err);
      });
  },


  saveToHistory() {
    if (!this.isCount) {
    this.$message.warning('请先点击计算后再保存！');
    return;
  }

  //const todayStr = this.getTodayString();
  //console.log(todayStr)
  const todayStr = this.date2;
  // -------------------------
  // 1. 读取 localStorage 历史记录
  // -------------------------
  let history = localStorage.getItem('wage_history');
  history = history ? JSON.parse(history) : [];

  // 删除同一天旧数据（幂等）
  history = history.filter(item => item.date !== todayStr);

  // -------------------------
  // 2. 统一结构转换函数
  // -------------------------
  function normalizeRecord(r) {
    return {
      date: r.date || todayStr,
      userId: r.userId || r.user_id || r.id || null,
      name: r.name || null,
      type: Number(r.type) || null,
      wage: Number(r.wage) || 0,

      // type 1 提成
      percent: r.percent || null,
      benefit: r.benefit || null,
      // type 2 日薪
      daily: r.daily || null,
      ot: r.ot || null,

      // type 3 时薪
      hr: r.hr || null,
      time1: r.time1 || null,
      time2: r.time2 || null,
      buzhu: r.buzhu || null,
    };
  }

  // -------------------------
  // 3. 收集今日记录（前端 List 1/2/3）
  // -------------------------
  let dailyRecords = [];
  
  // List 1（提成）
  this.list1.forEach(item => {
    if (item.isSelected && item.wage > 0) {
      dailyRecords.push(normalizeRecord({
        date: todayStr,
        userId: item.id,
        name: item.name,
        benefit:item.benefit,
        type: 1,
        wage: item.wage,
        percent: item.percent
      }));
    }
  });
  console.log(this.list1,777)
  // List 2（日薪）
  this.list2.forEach(item => {
    if (item.isSelected && item.wage > 0) {
      dailyRecords.push(normalizeRecord({
        date: todayStr,
        userId: item.id,
        name: item.name,
        type: 2,
        wage: item.wage,
        daily: item.daily,
        ot: item.ot
      }));
    }
  });

  // List 3（兼职）
  this.list3.forEach(item => {
    if (item.isSelected && item.wage > 0) {
      dailyRecords.push(normalizeRecord({
        date: todayStr,
        userId: item.id,
        name: item.name,
        type: 3,
        wage: item.wage,
        hr: item.hr,
        time1: item.time1,
        time2: item.time2,
        buzhu: item.buzhu
      }));
    }
  });

  if (dailyRecords.length === 0) {
    this.$message.warning('今日没有任何工资记录。');
    return;
  }

  // -------------------------
  // 4. 追加并保存到 localStorage
  // -------------------------
  history = [...history, ...dailyRecords];
  localStorage.setItem('wage_history', JSON.stringify(history));

  this.$message.success(`保存成功！日期: ${todayStr}，共 ${dailyRecords.length} 条记录。`);
    // 1. 检查是否已经计算过
    // if (!this.isCount) {
    //   this.$message.warning('请先点击计算后再保存！');
    //   return;
    // }

    // const todayStr = this.getTodayString(); // 你也可以绑定一个 el-date-picker 变量来选日期

    // // 2. 读取现有历史记录
    // let history = localStorage.getItem('wage_history');
    // history = history ? JSON.parse(history) : [];

    // // 3. 【关键步骤】删除“今天”已有的记录
    // history = history.filter(item => item.date !== todayStr);

    // // 4. 收集所有列表的数据
    // let dailyRecords = [];
    
    // // 处理 List 1 (全职)
    // this.list1.forEach(item => {
    //   if (item.isSelected && item.wage > 0) {
    //     dailyRecords.push({
    //       date: todayStr,
    //       userId: item.id,
    //       name: item.name,
    //       type: 1, 
    //       wage: Number(item.wage), 
    //       percent: item.percent 
    //     });
    //   }
    // });

    // // 处理 List 2 (日薪)
    // this.list2.forEach(item => {
    //   if (item.isSelected && item.wage > 0) {
    //     dailyRecords.push({
    //       date: todayStr,
    //       userId: item.id,
    //       name: item.name,
    //       type: 2,
    //       wage: Number(item.wage),
    //       daily: item.daily, 
    //       ot: item.ot
    //     });
    //   }
    // });

    // // 处理 List 3 (兼职)
    // this.list3.forEach(item => {
    //   if (item.isSelected && item.wage > 0) {
    //     dailyRecords.push({
    //       date: todayStr,
    //       userId: item.id,
    //       name: item.name,
    //       type: 3,
    //       wage: Number(item.wage),
    //       hr: item.hr,
    //       time1: item.time1,
    //       time2: item.time2, // ✨ 新增：保存第二个时间点
    //       buzhu: item.buzhu
    //     });
    //   }
    // });

    // // 5. 合并并保存
    // if (dailyRecords.length === 0) {
    //   this.$message.warning('没有产生任何工资记录，未保存。');
    //   return;
    // }

    // // 将新记录追加到历史记录中
    // history = [...history, ...dailyRecords];
    
    // // 写入 localStorage
    // localStorage.setItem('wage_history', JSON.stringify(history));
    // this.$message.success(`保存成功！日期: ${todayStr}，共 ${dailyRecords.length} 条记录。`);

    if (dailyRecords.length === 0) {
        this.$message.warning('没有产生任何工资记录，未保存。');
        return;
    }

    // 4. 【新增】发送数据到 Laravel 后台
    let obj2={
      cash:this.cash,
      credit:this.credit,
      tips1:this.totalTips1,
      tips2:this.totalTips2,
      percent3: this.percent3,
      totalPercent: this.totalPercent
    }
    const payload = {
        date: todayStr,
        records: dailyRecords,
        business: obj2
    };
    
    // 可以添加 loading 状态
    // this.isSaving = true; 

    // 使用 axios 发送 POST 请求到 Laravel API
    // 假设您的后端服务运行在 /api/wage-records
    this.$http.post('/history', payload)
        .then(response => {
            // 后台保存成功后，再进行本地 localStorage 的保存 (可选，通常只在后台保存成功后才进行本地更新)
            // 假设您还需要保持本地历史记录功能，执行原代码中的本地保存逻辑
            
            // --- 原本地保存逻辑开始 ---
            let history = localStorage.getItem('wage_history');
            history = history ? JSON.parse(history) : [];
            // 删除今天的记录 (为了和后台行为保持一致，但如果以后台为准，这步可以省略或改为从后台获取)
            history = history.filter(item => item.date !== todayStr);
            // 合并新记录
            history = [...history, ...dailyRecords];
            localStorage.setItem('wage_history', JSON.stringify(history));
            // --- 原本地保存逻辑结束 ---

            this.$message.success(`数据同步后台并保存成功！日期: ${response.data.date}，共 ${response.data.count} 条记录。`);
        })
        .catch(error => {
            console.error('保存失败:', error);
            const errorMessage = error.response && error.response.data && error.response.data.message
                                 ? error.response.data.message 
                                 : '后台数据保存失败，请检查网络或控制台错误。';
            this.$message.error(errorMessage);
        })
        .finally(() => {
            // this.isSaving = false;
        });
  },
    getMax(){
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
    },
    findName(name){
      let list1 = localStorage.getItem('list1')!=null?JSON.parse(localStorage.getItem('list1')):[];
      let list2 = localStorage.getItem('list2')!=null?JSON.parse(localStorage.getItem('list2')):[];
      let list3 = localStorage.getItem('list3')!=null?JSON.parse(localStorage.getItem('list3')):[];
      let users = [...list1,...list2,...list3]
      let exists = users.some(user => user.name === name);
      if (exists) {
        this.$message.error('用户名已存在');
        return false
      }else{
        return true
      }
    },
    sub1(){
      if (!this.type1Name.trim()) {
        this.$message.error('用户名不能为空');
        return;
      }
      if (this.type1percent == null) {
        this.$message.error('点数不能为空');
        return;
      }
      if(this.isEdit){
        if(this.type==1&&this.type==this.currentList){
          //list1中修改
          this.list1[this.currentIndex].name = this.type1Name
          this.list1[this.currentIndex].percent = this.type1percent
          localStorage.setItem('list1', JSON.stringify(this.list1));
          this.update()
          this.$message({
              message: '修改成功',
              type: 'success'
          });
          this.isEdit = false
          this.isClosed = true
        }else{
          if(this.currentList==2){
            //从list2里变成list1里
            this.list2.splice(this.currentIndex, 1)
            let obj = {}
            obj.name = this.type1Name
            obj.percent=this.type1percent
            obj.isShow = false
            obj.id = this.currentId
            this.list1.push(obj)
            localStorage.setItem('list2', JSON.stringify(this.list2));
            localStorage.setItem('list1', JSON.stringify(this.list1));
            this.update()
            this.$message({
                message: '修改成功',
                type: 'success'
            });
            this.isEdit = false
            this.isClosed = true
          }
          if(this.currentList==3){
            this.list3.splice(this.currentIndex, 1)
            let obj = {}
            obj.name = this.type1Name
            obj.percent=this.type1percent
            obj.isShow = false
            obj.id = this.currentId
            this.list1.push(obj)
            localStorage.setItem('list3', JSON.stringify(this.list3));
            localStorage.setItem('list1', JSON.stringify(this.list1));
            this.$message({
                message: '修改成功',
                type: 'success'
            });
            this.update()
            this.isEdit = false
            this.isClosed = true
          }
        }

        return false
      }
      let isName = this.findName(this.type1Name)
      if(!isName){
        return false
      }
      let list1 = JSON.parse(localStorage.getItem('list1'));
      let obj = {}
      obj.name = this.type1Name
      obj.percent=this.type1percent
      obj.isShow = false
      if (list1) {
        obj.id = this.maxId+1
        list1.push(obj)
        this.list1 = list1
        localStorage.setItem('list1', JSON.stringify(list1));
        this.maxId = this.maxId + 1
      }else{
        if(this.maxId==0||this.maxId==null){
          obj.id = 10001
          this.maxId = 10001
        }else{
          obj.id = this.maxId + 1
          this.maxId = this.maxId + 1
        }
        let arr = []
        arr.push(obj)
        localStorage.setItem('list1', JSON.stringify(arr));
      }
      this.type1Name = ''
      this.type1percent = null
      this.$message({
          message: '添加成功',
          type: 'success'
      });
      this.getList()
      this.update()
    },
    sub2(){
      if (!this.type2Name.trim()) {
        this.$message.error('用户名不能为空');
        return;
      }
      if (this.type2daily == null) {
        this.$message.error('日薪不能为空');
        return;
      }
      if(this.isEdit){
        if(this.type==2&&this.type==this.currentList){
          this.list2[this.currentIndex].name = this.type2Name
          this.list2[this.currentIndex].daily = this.type2daily
          localStorage.setItem('list2', JSON.stringify(this.list2));
          this.$message({
              message: '修改成功',
              type: 'success'
          });
          this.isEdit = false
          this.isClosed = true
          this.update()
        }else{
          if(this.currentList==1){
            this.list1.splice(this.currentIndex, 1)
            let obj = {}
            obj.wage = ''  // 提前声明
            obj.ot = ''    // 提前声明
            obj.name = this.type2Name
            obj.daily=this.type2daily
            obj.isShow = false
            obj.id = this.currentId
            this.list2.push(obj)
            localStorage.setItem('list2', JSON.stringify(this.list2));
            localStorage.setItem('list1', JSON.stringify(this.list1));
            this.$message({
                message: '修改成功',
                type: 'success'
            });
            this.isEdit = false
            this.isClosed = true
            this.update()
          }
          if(this.currentList==3){
            this.list3.splice(this.currentIndex, 1)
            let obj = {}
            obj.name = this.type2Name
            obj.daily=this.type2daily
            obj.isShow = false
            obj.id = this.currentId
            this.list2.push(obj)
            localStorage.setItem('list3', JSON.stringify(this.list3));
            localStorage.setItem('list2', JSON.stringify(this.list2));
            this.$message({
                message: '修改成功',
                type: 'success'
            });
            this.isEdit = false
            this.isClosed = true
            this.update()
          }
        }
        return false
      }
      let isName = this.findName(this.type2Name)
      if(!isName){
        return false
      }
      let list2 = JSON.parse(localStorage.getItem('list2'))
      let obj = {}
      obj.name = this.type2Name
      obj.daily=this.type2daily
      obj.isShow = false
      if (list2) {
        obj.id = this.maxId+1
        list2.push(obj)
        this.list2 = list2
        localStorage.setItem('list2', JSON.stringify(list2));
        this.maxId = this.maxId + 1
      }else{
        if(this.maxId==0||this.maxId==null){
          obj.id = 10001
          this.maxId = 10001
        }else{
          obj.id = this.maxId + 1
          this.maxId = this.maxId + 1
        }
        let arr = []
        arr.push(obj)
        localStorage.setItem('list2', JSON.stringify(arr));
      }
      this.type2Name = ''
      this.type2daily = null
      this.$message({
          message: '添加成功',
          type: 'success'
      });
      this.getList()
      this.update()
    },
    update(){
      const dataToSync = {
        list1: JSON.parse(localStorage.getItem("list1")),
        list2: JSON.parse(localStorage.getItem("list2")),
        list3: JSON.parse(localStorage.getItem("list3")),
      }
      this.$http.post('/update1',{
        list:dataToSync
      })
      .then(res => {
      })
      .catch(error => {
          console.error('请求失败:', error)
      })
    },
    sub3(){
      if (!this.type3Name.trim()) {
        this.$message.error('用户名不能为空');
        return;
      }
      if (this.type3hr == null) {
        this.$message.error('时薪不能为空');
        return;
      }
      if(this.isEdit){
        if(this.type==3&&this.type==this.currentList){
          this.list3[this.currentIndex].name = this.type3Name
          this.list3[this.currentIndex].hr = this.type3hr
          this.list3[this.currentIndex].ot = this.type3hr2
          this.list3[this.currentIndex].buzhu = this.type3hr3
          localStorage.setItem('list3', JSON.stringify(this.list3));
          this.update()
          this.$message({
              message: '修改成功',
              type: 'success'
          });
          this.isEdit = false
          this.isClosed = true
        }else{
          if(this.currentList==1){
            this.list1.splice(this.currentIndex, 1)
            let obj = {}
            obj.wage = ''  // 提前声明
            obj.time1 = '' // 提前声明
            obj.time2 = '' // 提前声明
            obj.name = this.type3Name
            obj.hr=this.type3hr
            obj.ot=this.type3hr2
            obj.buzhu=this.type3hr3
            obj.isShow = false
            obj.id = this.currentId
            this.list3.push(obj)
            localStorage.setItem('list3', JSON.stringify(this.list3));
            localStorage.setItem('list1', JSON.stringify(this.list1));
            this.$message({
                message: '修改成功',
                type: 'success'
            });
            this.isEdit = false
            this.isClosed = true
            this.update()
          }
          if(this.currentList==2){
            this.list2.splice(this.currentIndex, 1)
            let obj = {}
            obj.name = this.type3Name
            obj.hr=this.type3hr
            obj.ot=this.type3hr2
            obj.buzhu=this.type3hr3
            obj.isShow = false
            obj.id = this.currentId
            this.list3.push(obj)
            localStorage.setItem('list3', JSON.stringify(this.list3));
            localStorage.setItem('list2', JSON.stringify(this.list2));
            this.update()
            this.$message({
                message: '修改成功',
                type: 'success'
            });
            this.isEdit = false
            this.isClosed = true
          }
        }
        return false
      }
      let isName = this.findName(this.type3Name)
      if(!isName){
        return false
      }
      let list3 = JSON.parse(localStorage.getItem('list3'));
      let obj = {}
      obj.name = this.type3Name
      obj.hr=this.type3hr
      obj.ot=this.type3hr2
      obj.buzhu=this.type3hr3
      obj.isShow = false
      if (list3) {
        obj.id = this.maxId+1
        list3.push(obj)
        this.list3 = list3
        localStorage.setItem('list3', JSON.stringify(list3));
        this.maxId = this.maxId + 1
      }else{
        if(this.maxId==0||this.maxId==null){
          obj.id = 10001
          this.maxId = 10001
        }else{
          obj.id = this.maxId + 1
          this.maxId = this.maxId + 1
        }
        let arr = []
        arr.push(obj)
        localStorage.setItem('list3', JSON.stringify(arr));
      }
      this.type3Name = ''
      this.type3hr = null
      this.type3hr2 = null
      this.type3hr3 = null
      this.$message({
          message: '添加成功',
          type: 'success'
      });
      this.getList()
      this.isClosed = true
      this.update()
    },
    open(){
      this.type = 1
      this.type1Name=''
      this.type1percent=null
      this.type2Name=''
      this.type2daily=null
      this.type3Name=''
      this.type3hr=null
      this.type3hr2=null
      this.type3hr3=null
      this.isClosed = false
    },
    close(){
      this.isClosed = true
      this.type = 1
      this.type1Name=''
      this.type1percent=null
      this.type2Name=''
      this.type2daily=null
      this.type3Name=''
      this.type3hr=null
      this.type3hr2=null
      this.type3hr3=null
      this.selectedDate=''
      this.singleResult=[]
    }
  }
}
</script>

<style scoped>
  .r1{
    display: flex;
    align-items: center;
    flex-flow: wrap;
  }
  .r1 div{
  }
  .result{
    width: 100%;
    height: 120px;
    margin-top: -30px;
    border: 1px solid #f2f2f2;
    box-sizing: border-box;
    padding: 10px;
  }
  .t3 /deep/ .el-input__inner {
    border: none;
    background-color: transparent;
  }
  .range-start {
    background: #409EFF;
    color: white;
    border-radius: 50%;
  }
  /* 终点 */
  .range-end {
    background: #409EFF;
    color: white;
    border-radius: 50%;
  }

/* 中间区间 */
.range-middle {
  background: rgba(64, 158, 255, 0.25);
  color: #333;
  border-radius: 0;
}
  .future-date-gray {
  color: #a0a0a0 !important; /* 设置较浅的灰色 */
  opacity: 0.6; /* 可以降低透明度 */
  /* 其他样式如背景色等 */
}

/* 2. 可选：调整日期单元格的内边距，让内容更好地显示 */
.el-calendar-day {
  padding: 0; /* 移除默认的内边距 */
  height: 100%; /* 确保高度填充 */
  width: 100%;
}

/* 3. 确保自定义内容完全覆盖单元格 */
.date-cell-content {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  /* 调整字体大小等 */
}
  /deep/ .el-calendar-table .el-calendar-day{
    width: 50px;
    height: 40px;
  }
  /deep/ .el-calendar__button-group button:last-child {
    display: none;
  }

  .listItem{
    display: flex;
    justify-content: center;
    height: 40px;
    align-items: center;
    border-bottom: 1px solid #f2f2f2;
    width: 600px;
    position: relative;
  }
.add5{
  width: 100%;
  height: 540px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.add4{
  width: 800px;
  height: 600px;
  background-color: white;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: visible;
  position: relative;
}
.type1{
  display: flex;
  flex-direction: column;
  margin-top: 30px;
}
.add2{
  width: 600px;
  height: 570px;
  background-color: white;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: visible;
}
.add,.add3{
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.add{
  z-index: 4;
}
.add3{
  z-index: 3;
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
.dian2{
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 7px;
  background-color: #ccc;
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
