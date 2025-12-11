<template>
  <div>
     <div style="width: 400px;">
        <div style="display:flex;align-items: center;width: 500px;height: 100px;border: 1px solid black;justify-content: center;">
          <el-checkbox style="margin-right: 30px;" v-model="isChecked" @change="changeMode">统计模式</el-checkbox>
          <el-select v-model="selectedStaffId" placeholder="请选择工作人员">
            <el-option v-for="item in staffList" :key="item.id"  :label="item.name" :value="item.id" />
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
</template>

<script>
export default {
  data () {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    today.setUTCHours(0,0,0,0);
    return {
      selectedStaffId: null,
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
