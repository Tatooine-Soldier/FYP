<template>
    <article id="calendar">
      <header>
        <div class="current-date">
          <div class="current-day">
            {{ weekdayNames[currentDay] }}
          </div>
          <div class="today">
            <div><div class="arrow-up" @click="dateUp()"></div></div>
            <div><div class="arrow-up" @click="monthUp()"></div></div>
            <div><div class="arrow-up" @click="currentDate.year += 1"></div></div>
            <div>{{ currentDate.date }}</div>
            <div>{{ month[currentDate.month] }}</div>
            <div>{{ currentDate.year }}</div>
            <div><div class="arrow-down" @click="dateDown()"></div></div>
            <div><div class="arrow-down" @click="monthDown()"></div></div>
            <div><div class="arrow-down" @click="currentDate.year -= 1"></div></div>
          </div>
        </div>
      </header>
      <section>
        <div class="weekdays">
          <div class="weekday" v-for="(weekday, index) in weekdays" :key="index">
            {{ weekday }}
          </div>
        </div>
        <div class="date">
          <div class="day-hidden" v-for="(n, index) in (firstMonthDay -1)" :key="'prev'+index">
            {{ (prevMonthDays +1) - firstMonthDay + n }}
          </div>
          <div class="day" 
              :class="{ active: n === currentDate.date}"
              @click="currentDate.date = n"
              v-for="(n, index) in currentMonthDays" 
              :key="'day'+index">
            {{ n }}
          </div>
          <div class="day-hidden" v-for="(n, index) in (43 - (currentMonthDays + firstMonthDay))" :key="'next'+index">
            {{ n }}
          </div>
        </div>
      </section>
    </article>
  </template>
  
  <script>
    export default {
      data: function() {
        return {
          weekdays: ['Mo','Tu','We','Th','Fr','Sa','Su'],
          weekdayNames: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
          month: [
            'January','February','March','April','May','June','July',
            'August','September','October','November','December'
          ],
          currentDate: {
            date: 0,
            month: 0,
            year: 0
          },
          bookedDates: null
        }
      },
      props: ['propdates'],
      computed: {
        prevMonthDays() {
          let year = this.currentDate.month === 0 ? this.currentDate.year - 1 : this.currentDate.year;
          let month = this.currentDate.month === 0 ? 12 : this.currentDate.month;
          return new Date(year, month, 0).getDate();
        },
        firstMonthDay() {
          let firstDay = new Date(this.currentDate.year, this.currentDate.month, 1).getDay();
          if(firstDay === 0) firstDay = 7;
          return firstDay;
        },
        currentDay() {
          return new Date(this.currentDate.year, this.currentDate.month, this.currentDate.date).getDay();
        },
        currentMonthDays() {
          return new Date(this.currentDate.year, this.currentDate.month +1, 0).getDate();
        }
      },
      methods: {
        getCurrentDate() {
          let today = new Date();
          this.currentDate.date = today.getDate();
          this.currentDate.month = today.getMonth();
          this.currentDate.year = today.getFullYear();
        },
        dateUp() {
          if(this.currentDate.date === this.currentMonthDays) {
            this.currentDate.date = 1;
            this.monthUp();
          }
          else {
            this.currentDate.date += 1;
          }
        },
        dateDown() {
          if(this.currentDate.date === 1) {
            this.currentDate.date = this.prevMonthDays;
            this.monthDown();
          }
          else {
            this.currentDate.date -= 1;
          }
        },
        monthUp() {
          if(this.currentDate.month === 11) {
            this.currentDate.month = 0;
            this.currentDate.year += 1;
          }
          else {
            this.currentDate.month += 1;
          }        
        },
        monthDown() {
          if(this.currentDate.month === 0) {
            this.currentDate.month = 11;
            this.currentDate.year -= 1;
          }
          else {
            this.currentDate.month -= 1;
          } 
        }
      }
    }
  </script>
  
  <style scoped>
    @import url('https://fonts.googleapis.com/css?family=Anton');
    #calendar {
      width: 460px;
      height: 730px;
      background-color: #efefef;
      font-family: 'Anton';
      border-radius: 15px;
      overflow: hidden;
      background-size: cover;
      user-select: none;
    }
    header {
        display: flex;
        justify-content: center;
        align-items: top;
        height: 400px;
        padding: 20px 0 0;
        text-align: center;
        overflow: hidden;
        color: #efefef;
        text-shadow: 1px 1px 1px #222,
          1px -1px 1px #222,
          -1px 1px 1px #222,
          -1px -1px 1px #222;
    }
        .current-date {
          width: 300px;
        }
        .arrow-up {
          border-bottom: 10px solid #fff;
        }

        .arrow-up:hover {
          border-bottom: 10px solid rgba(0,0,0,.4);
        }
        .arrow-down {
          border-top: 10px solid #fff;
        }
        .arrow-down:hover {
            border-top: 10px solid rgba(0,0,0,.4);
        }
        .today {
          display: grid;
          grid-template-columns: 40px auto 70px;
          grid-gap: 0;
        }

        .today div { 
            display: flex;
            justify-content: center;
        }
        .current-day {
          font-size: 4rem;
        }
        .today {
          font-size: 2rem;
        }
      .weekdays {
        background-color: rgba(0,0,0,.5);
        border-bottom: 1px solid #fff;
      }

      .weekdays div:nth-child(7n) {
            color: #D43541;
      }
      .date {
        background-color: rgba(0,0,0,.7);
      }

      .date .active {
        background-color: #fff;
        color: #2A4C50;
      }
        .day {
          cursor: pointer;
        }
        .day:hover {
            background-color: #fff;
            color: #2A4C50;
        }

        .day:nth-child(7n) {
            color: #D43541;
        }
        .day:nth-child(7n):hover {
            background-color: #fff;
            color: #D43541;
        }

        .day-hidden {
          opacity: .4;
        }
      
        .day-hidden:nth-child(7n) {
            color: #D43541;
        }
    
  </style>