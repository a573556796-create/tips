<template>
  <div>
     <div style="width: 400px;">
        <div style="display:flex;flex-direction: column;align-items: center;width: 500px;height: 100px;border: 1px solid black;justify-content: center;">
          <!-- <el-checkbox style="margin-right: 30px;" v-model="isChecked" @change="changeMode">统计模式</el-checkbox> -->
          <el-select v-model="selectedMode" @change="changeMode" placeholder="请选择工作人员">
            <el-option v-for="item in options" :key="item.type"  :label="item.label" :value="item.type" />
          </el-select>
          <el-select v-model="selectedUserId" @change="search" placeholder="请选择工作人员">
            <el-option v-for="item in allUser" :key="item.id"  :label="item.name" :value="item.id" />
          </el-select>
        </div>
        <div style="margin-bottom:8px;">
              </div>
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
                        <div v-if="selectedMode === 2&&salaryMap[data.day]" class="salary">
                          ${{ salaryMap[data.day] }}
                        </div>
                      </div>
                    </template>
                  </el-calendar>
                  <div class="result" style="overflow: scroll;">
                      <div v-if="selectedMode==3&&selectedUserId==10000">
                        <div v-for="(item,index) in allUserSummary">
                          <span v-if="item.type==1">{{item.name}}:(${{item.totalWage}})({{item.days}}天)</span>
                          <span v-if="item.type==2">{{item.name}}:(${{item.totalWage}})({{item.days}}天)</span>
                          <span v-if="item.type==3">{{item.name}}:(${{item.totalWage}})({{item.days}}天)({{item.totalTime1}}h<span v-if="item.totalTime2!==0">+加班{{item.totalTime2}}h</span>)</span>
                        </div>
                      </div>
                      <div v-if="selectedMode==2">共计${{singleMonthTotal}}(共{{singleDays}}天<span v-if="totalTime1!=0">{{totalTime1}}小时，加班{{totalTime2}}小时</span>)</div>
                      <div v-if="selectedMode==3&&selectedUserId!==10000">共计${{singleRangeTotal}}(共{{singleDays2}}天<span v-if="totalTime1!=0">{{totalTime1}}小时，加班{{totalTime2}}小时</span>)</div>
                      <div class="r1" v-if="selectedMode==1">
                        <div style="margin-right: 5px" v-for="item in singleResult" v-if="item.type==1">{{item.name}}:{{item.wage}}</div>
                      </div>
                      <div class="r1" v-if="selectedMode==1">
                        <div style="margin-right: 5px" v-for="item in singleResult" v-if="item.type==2">{{item.name}}:{{item.wage}}</div>
                        <div style="margin-right: 5px" v-for="item in singleResult" v-if="item.type==3">{{item.name}}:{{item.wage}}({{item.time1}}h<span v-if="item.time2">+{{item.time2}}h</span>)</div>
                      </div>
                  </div>
              </div>
  </div>
</template>

<script>
export default {
  data () {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    today.setUTCHours(0,0,0,0);
    return {
      selectedMode:null,
      selectedUserId: null,
      singleResult: [],
      selectedDate:'',
      todayLocalTimestamp: today.getTime(),
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
      checked: true,
      input:0,
      totalPercent:null,
      list1:[],
      list2:[],
      list3:[],
      options: [
        // { type: 1, label: '普通模式' },
        { type: 2, label: '整月模式' },
        // { type: 3, label: '起止日期' }
      ],
      type: null,
      maxId: null,
      currentList: null,
      currentIndex:null,
      currentId:null,
      isCount:false,
      startTime:null,
      endTime:null,
      allUser:[],
      currentMonth:null,
      singleMonth:[],
      singleMonthTotal:0,//一个人的月度总工资
      singleDays:0,
      singleDays2:0,
      totalTime1:0,
      totalTime2:0,
      allUserSummary:[]
    }
  },
    computed: {
      salaryMap() {
        return Object.fromEntries(
          this.singleMonth.map(item => [item.date, item.wage])
        )
      },
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
    mounted(){
      const year = this.calendarValue.getUTCFullYear();
      const month = this.calendarValue.getUTCMonth() + 1;
      console.log(this.calendarValue.getUTCFullYear(),month)
      this.getList()
    },
    methods:{
          changeMode(){
            console.log(this.selectedMode)
            this.startDate = null;
            this.endDate = null;
            this.singleResult=[]
            this.singleMonthTotal=0
            this.selectedUserId=null
            this.salaryMap={}
            this.singleDays = 0
            this.singleMonth = this.singleMonth.map(item => ({
              ...item,
              wage: null   // 或 0，看你业务需求
            }))
            if(this.selectedMode==3){
              this.isChecked = true
            }
          },
          getOneUserMonth(id){
            const date = new Date(this.calendarValue);
            const year = this.calendarValue.getUTCFullYear();;
            // 补零处理，确保格式为 "2025-12"const month = 
            const month = String(new Date(this.calendarValue).getUTCMonth() + 1).padStart(2, '0');
            let current = `${year}-${month}`
            console.log(current,77)
            // let wage_history = localStorage.getItem('wage_history')!=null?JSON.parse(localStorage.getItem('wage_history')):[];
            // const month_result = wage_history.filter(item => item.userId == id)
            let wage_history = localStorage.getItem('wage_history') != null ? JSON.parse(localStorage.getItem('wage_history')) : [];
            const month_result = wage_history.filter(item => {
                return item.userId == id && item.date.startsWith(current);
            });
            this.singleMonth = month_result
            let total = month_result.reduce((sum, item) => sum + Number(item.wage), 0)
            let totalTime1 = month_result.reduce(
              (sum, item) => item.type === 3 ? sum + Number(item.time1) : sum,
              0
            );
            let totalTime2 = month_result.reduce(
              (sum, item) => item.type === 3 ? sum + Number(item.time2) : sum,
              0
            );
            this.singleDays = month_result.length
            console.log(month_result.length,9)
            this.singleMonthTotal = total
            this.totalTime1=totalTime1
            this.totalTime2=totalTime2
          },
          getAllUsersWorkSummaryByDateRange(startDate, endDate) {
            let wage_history = localStorage.getItem('wage_history')
              ? JSON.parse(localStorage.getItem('wage_history'))
              : [];

            const start = new Date(startDate).getTime();
            const end = new Date(endDate).getTime();

            const resultMap = {};

            wage_history.forEach(item => {
              if (!item.userId || !item.date) return;

              const d = new Date(item.date).getTime();
              if (isNaN(d) || d < start || d > end) return;

              const userId = Number(item.userId);
              const type = item.type || 'unknown';
              const key = `${userId}_${type}`;

              if (!resultMap[key]) {
                resultMap[key] = {
                  userId,
                  name: item.name || '',
                  type,
                  totalWage: 0,
                  days: 0,
                  totalTime1: 0,
                  totalTime2: 0
                };
              }

              resultMap[key].totalWage += Number(item.wage || 0);
              resultMap[key].days += 1;

              if (type === 3) {
                resultMap[key].totalTime1 += Number(item.time1 || 0);
                resultMap[key].totalTime2 += Number(item.time2 || 0);
              }
            });

            // 👇 关键优化：排序
            const result = Object.values(resultMap).sort((a, b) => {
              if (a.userId !== b.userId) {
                return a.userId - b.userId; // id 小的在前
              }
              return a.type - b.type; // 同一人按 type 排（可删）
            });

            console.log('区间内所有人（已排序）：', result);

            this.allUserSummary = result;
          },
          getOneUserByDateRange(id, startDate, endDate) {
              let wage_history = localStorage.getItem('wage_history')
                ? JSON.parse(localStorage.getItem('wage_history'))
                : [];

              const start = new Date(startDate).getTime();
              const end = new Date(endDate).getTime();

              const range_result = wage_history.filter(item => {
                const d = new Date(item.date).getTime(); // 👈 确保字段名正确
                return (
                  item.userId == id &&
                  d >= start &&
                  d <= end
                );
              });

              console.log('range_result', range_result);

              let total = range_result.reduce(
                (sum, item) => sum + Number(item.wage || 0),
                0
              );

              this.singleRangeTotal = total;
              this.singleDays2 = range_result.length;
          },
          search(){
            // if(this.selectedMode==3){
            //   this.startDate = null;
            //   this.endDate = null;
            // }
            const month = new Date(this.calendarValue).getUTCMonth() + 1
            console.log(month,88)
            this.currentMonth = month
            this.getOneUserMonth(this.selectedUserId)
            if(this.selectedUserId!==null){
               this.getOneUserByDateRange(this.selectedUserId,this.startDate,this.endDate)
            }
            console.log(this.selectedUserId,month,this.startDate.this.endDate)
          },
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
            const result = [...list1, ...list2, ...list3].map(({ id, name }) => ({ id, name }))
            result.unshift({id:10000,name:'所有人'})
            this.allUser=result
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
            if(this.selectedUserId==null){
              this.$message.error('先选择人员');
              return
            }
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
                console.log('结束了', this.selectedUserId,this.startTime,this.endTime);
                if(this.selectedUserId==10000){
                  this.getAllUsersWorkSummaryByDateRange(this.startTime,this.endTime)
                }else{
                  this.getOneUserByDateRange(this.selectedUserId,this.startDate,this.endDate)
                }
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
    }
}
</script>

<style scoped>
  .salary {
    font-size: 12px;
    color: #409EFF;
    margin-top: 4px;
    position: absolute;
    bottom: -10px;
  }
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
  position: relative;
  /* 调整字体大小等 */
}
  /deep/ .el-calendar-table .el-calendar-day{
    width: 50px;
    height: 40px;
  }
  /deep/ .el-calendar__button-group button:last-child {
    display: none;
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
.ipt{
  width:200px
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
</style>
