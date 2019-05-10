<template>
    <section>
        <el-row>
            <el-col :span="24">
                <div  >
                    <span class="demonstration">选择查询时间段: </span>
                    <el-date-picker
                            v-model="value1"
                            type="daterange"
                            align="right"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions">
                    </el-date-picker>
                <el-button @click="selectmaster">查询</el-button>
            </div> </el-col>

               </el-row>
        <el-row>
            <el-col :span="12">
                <div><el-input
                        v-model="search"
                        placeholder="检索单号"   ><el-button slot="append" icon="el-icon-circle-close" @click="deleteinput"></el-button>
                </el-input></div>
            </el-col>
        </el-row>
        <el-table v-loading="orderloading"
                  element-loading-text="拼命加载中"
                  element-loading-spinner="el-icon-loading"
                  :cell-style="{padding: 0}"  ref="multipleTable" :data="(orderlist.filter(data=> ! search  || data.sheet_no.toLowerCase().includes(search.toLowerCase()) ).slice((currentPage-1)*pageSize,currentPage*pageSize))"  style="width: 100%" >
            <el-table-column prop="oper_date" label="日期" width="180" sortable></el-table-column>
            <el-table-column prop="sheet_no" label="单号" width="200"></el-table-column>
            <el-table-column  :formatter="formatnum" prop="sheet_amt" label="金额" width="100"></el-table-column>
            <el-table-column prop="branch" label="配送单位" width="100"></el-table-column>
            <el-table-column prop="recordStatus" label="操作" width="80">
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="small">打开</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background
                       :small="true"
                       @size-change="handleSizeChange"
                       @current-change="current_change"
                       :current-page="currentPage"
                       :page-sizes="[10, 50, 100, 200]"
                       :page-size="pageSize"
                       layout="total, sizes, prev, pager, next"
                       :total="total">
        </el-pagination>
        <el-dialog title="订单明细" :visible.sync="detalialogVisible"  :close-on-click-modal="false" width="800px"  center>
            <span >订单号:{{this.sheetno}}</span>
            <el-table v-loading="orderloading2"
                      element-loading-text="拼命加载中"
                      element-loading-spinner="el-icon-loading"
                    :data="orderdetail" ref="multipleTable">
                <el-table-column prop="item_no" label="货号" width="120" ></el-table-column>
                <el-table-column prop="item_name" label="名称" width="200" ></el-table-column>
                <el-table-column prop="unit_no" label="单位" width="60" ></el-table-column>
                <el-table-column prop="item_size" label="规格" width="80" ></el-table-column>
                <el-table-column :formatter="formatnum1" prop="valid_price" label="单价" width="80" ></el-table-column>
                <el-table-column  :formatter="formatnum2" prop="real_qty" label="数量" width="80" ></el-table-column>
                <el-table-column :formatter="formatnum3" prop="sub_amt" label="金额" width="80" ></el-table-column>
            </el-table>
        </el-dialog>
    </section>

</template>
<script>
    import {formatDate} from '../../src/common/js/util.js'
    export default {
        data() {
            return {
                orderloading: false,
                orderloading2: false,
                sheetno:'',
                value1: '',//日期框接收值
                detalialogVisible:false,
                currentPage: 1,
                pageSize: 10,
                total:0,
                start:'',
                end:'',
                search:"",
                orderlist: [],
                orderdetail:[],
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
            };
        },
        methods:{
            handleClick(row){
                this.orderloading2= true
              console.log(row.sheet_no)
                this.sheetno = row.sheet_no.replace(/^\s*|\s*$/g,""),
                this.$axios.get('/getorderdetail', {
                    params: {
                        sheetno: this.sheetno
                    }
                })
                    .then((res) => {
                        console.log(res.data)
                        this.orderdetail = res.data
                        this.orderloading2 = false
                    })
                    .catch(function (err) {
                        console.log(err);

                    });
                this.detalialogVisible = true
            },
            deleteinput(){
                this.search = ""
            },
            ///////当页面修改时候
            handleSizeChange(val) {
                this.pageSize = val;
                this.currentPage = 1;
                this.fetchData(1, val);
                // console.log(`每页 ${val} 条`);
            },
            current_change: function (currentPage) {
                this.currentPage = currentPage;
            },
            /////修改小数位
            formatnum(row,column){
                return Number(row.sheet_amt).toFixed(2)

            },
            formatnum1(row,column){
                return Number(row.valid_price).toFixed(2)
            },
            formatnum2(row,column){
                return Number(row.real_qty).toFixed(2)
            },
            formatnum3(row,column){
                return Number(row.sub_amt).toFixed(2)
            },
            selectmaster(){
                if(this.value1[0]<this.value1[1]) {
                    this.start = formatDate(new Date(this.value1[0]), 'yyyy-MM-dd')
                    this.end = formatDate(new Date(this.value1[1]), 'yyyy-MM-dd')
                    this.orderloading = true

                    this.$axios.get('/getorderlist', {
                        params: {
                            start: this.start,
                            end:this.end,
                            customer: localStorage.getItem('oper_id')
                        }
                    })
                        .then((res) => {
                            console.log(res.data)
                            this.orderlist = res.data
                            this.total = res.data.length
                            this.orderloading = false
                        })
                        .catch(function (err) {
                            console.log(err);
                            this.$message.warning("查询超时!")
                        });
                }
                else
                {
                    this.$message.warning('请输入正确的时间!')
                }
            }
        }
    };

</script>

