<template>
    <section>
        <el-row >
            <el-col :span="15"><div class="grid-content bg-purple-dark" >
                <el-input
                        v-model="search"
                    size="mini"
                    placeholder="输入关键字搜索" class="input-with-select"  >
                    <el-select v-model="search" placeholder="选择类别" slot="prepend">
                        <el-option
                                v-for=" item in cls"
                                :key="item.item_clsno" :label="item.item_clsname" :value="item.item_clsno">
                        </el-option>
                    </el-select>
                </el-input>
                </div>
            </el-col>
            <el-col :span="4"><div class="grid-content bg-purple-dark" ><el-badge :value="Ordersinfo.total_qty" class="badge-item">

                <el-button   @click="dialogVisible = true" type="small" icon="el-icon-shopping-cart-2">订货车</el-button>
            </el-badge></div></el-col>
        </el-row>
        <!--el-table ref="multipleTable" :data="currData.slice((currentPage-1)*pageSize,currentPage*pageSize)" border style="width: 100%" @selection-change="handleSelectionChange"-->
            <el-table  :cell-style="{padding: 0}"  ref="multipleTable" :data="(currData.filter(data=> ! search  || data.item_clsno.toLowerCase().includes(search.toLowerCase())|| data.item_rem.toLowerCase().includes(search.toLowerCase()) ||data.item_no.toLowerCase().includes(search.toLowerCase())|| data.item_name.toLowerCase().includes(search.toLowerCase())) ).slice((currentPage-1)*pageSize,currentPage*pageSize)"  style="width: 100%" >
            <el-table-column prop="item_no" label="商品货号" width="120" sortable></el-table-column>
            <el-table-column prop="item_name" label="商品名称" width="200"></el-table-column>
            <el-table-column prop="unit_no" label="单位" width="60"></el-table-column>
            <el-table-column prop="item_size" label="规格" width="80"></el-table-column>
            <el-table-column prop="cls_name" label="类别" width="80"></el-table-column>
            <el-table-column  :formatter="formatnum" prop="appointed_price" label="单价" width="100"></el-table-column>
            <el-table-column   label="订货数量" width="100">
                <template slot-scope="scope">
                    <el-form :model="scope.row" >
                        <el-form-item prop="orderqty">
                            <el-input size="small" v-show="true" @blur="Blurnum($event)" v-model="scope.row.orderqty" placeholder="数量"/>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column prop="recordStatus" label="操作" width="80">
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="small">挑选</el-button>
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
        <el-dialog title="订货车" :visible.sync="dialogVisible" :close-on-click-modal="false" width="900px" >
            <el-table :summary-method="getSummaries" show-summary ref="multipleTable" :data="this.Ordersinfo.order_detail"  style="width: 100%">
                <el-table-column prop="item_no" label="商品货号" width="120" sortable></el-table-column>
                <el-table-column prop="item_name" label="商品名称" width="220"></el-table-column>
                <el-table-column prop="unit_no" label="单位" width="50"></el-table-column>
                <el-table-column prop="item_size" label="规格" width="80"></el-table-column>
                <el-table-column :formatter="formatnum" prop="appointed_price" label="单价" width="100"></el-table-column>
                <el-table-column prop="item_amt" label="小计" width="100"></el-table-column>
                <el-table-column  label="订货数量" width="100" >
                    <template slot-scope="scope" >
                        <el-form :model="scope.row" >
                            <el-form-item prop="orderqty">
                                <el-input   @change="getFullname(scope.row)" size="small" v-show="true" @blur="Blurnum($event)" v-model="scope.row.orderqty"   placeholder="数量"/>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column prop="recordStatus" label="删除" width="80">
                    <template slot-scope="scope">
                        <el-button @click="DeleteClick(scope.row)" type="warning" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click.native="postorder" :disabled="issubmit">提交</el-button>
            </div>
        </el-dialog>
        <el-dialog title="删除商品" :visible.sync="DeletedialogVisible"   :close-on-click-modal="false" width="300"  center>
            <span>确认删除改商品?</span>
            <div slot="footer" class="dialog-footer">

                <el-button @click.native="DeletedialogVisible = false">取消</el-button>
                <el-button type="primary" @click.native="Deletesubimt">删除</el-button>
            </div>
        </el-dialog>
        </section>

</template>
<script>
    import {getnow} from '../../src/common/js/util.js'
    export default {
        data() {
            return {
                issubmit: false, //提交按钮的状态
                Deleteitem: '',
                DeletedialogVisible: false,
                dialogVisible: false,
                search: '',
                cls: [],
                search_cls: '',
                selectcontion: '',
                total: 1000,
                currentPage: 1,
                pageSize: 10,
                currData: [],
                multipleSelection: [],
                Ordersinfo: {
                    customer: '',
                    order_date: '',
                    total_qty: 0,
                    total_amt: 0,
                    order_detail: []
                }  //当前编辑购物的信息
            }
        },
        created() {
            localStorage.getItem("currorders") && Object.assign(this.Ordersinfo, JSON.parse(localStorage.getItem("currorders")));
        },
        destroyed() {
            localStorage.setItem("currorders", JSON.stringify(this.Ordersinfo))

        },
        mounted: function () {
            this.$nextTick(function () {
                this.getgoodslist()
                this.getcls()
            })
        },

        methods: {
            ///提交订单
            postorder(){
                let arr = []

                arr = this.Ordersinfo.order_detail
                try{


                if(arr.length>0)
                {
                    this.issubmit = true
                    this.Ordersinfo.total_amt = 0
                    for (let i = 0; i < arr.length; i++)
                    {
                       this.Ordersinfo.total_amt = this.Ordersinfo.total_amt+ arr[i].item_amt //计算总金额
                        console.log(this.Ordersinfo.total_amt)
                    }
                    this.Ordersinfo.customer = localStorage.getItem('oper_id')  //获取客户id
                    this.Ordersinfo.total_qty = arr.length
                    this.Ordersinfo.order_date= getnow()
                    console.log(this.Ordersinfo)
                    this.$axios({
                        method:"post",
                        url:"/postordertail",
                        headers:{"Content-Type": "application/json;charset=utf-8"
                        },
                        data:this.Ordersinfo

                    })
                        .then((res) => {
                        if(   res.data.code ==="200")
                        {

                                    this.Ordersinfo.customer = '',
                                    this.Ordersinfo.order_date= '',
                                    this.Ordersinfo.total_qty= 0,
                                    this.Ordersinfo.total_amt= 0,
                                    this.Ordersinfo.order_detail= []

                            localStorage.removeItem("currorders")
                            this.$message.success('提交成功!生成单号:'+res.data.sheet_no)
                        }
                        else
                        {
                            this.$message.warning('提交失败!')
                            this.issubmit = false
                        }
                        })
                        .catch(function (err) {
                            console.log(err);
                        });


                }
            }
            catch (err){
                alert(err)
            }
            }
            ,
            /////修改小数位
            formatnum(row,colum){
                return Number(row.appointed_price).toFixed(2)
    },
            //////////////计算行金额
            getFullname(row){
                console.log(row)
                row.item_amt=row.orderqty*row.appointed_price
            },

            //////打开删除窗口
            DeleteClick(row) {
                this.Deleteitem = row.item_no
                this.DeletedialogVisible = true
            },
            Deletesubimt() {
                let arr = []
                arr = this.Ordersinfo.order_detail
                for (let i = 0; i < arr.length; i++) {

                    if (arr[i].item_no === this.Deleteitem) {
                        arr.splice(i, 1);
                        this.Ordersinfo.total_qty = this.Ordersinfo.total_qty - 1
                    }
                }
                this.DeletedialogVisible = false
            }
            ,///////////处理数字的输入
            Blurnum(e) {
                let boolean = new RegExp("(^[\\-0-9][0-9]*(.[0-9]+)?)$").test(e.target.value)
                if (!boolean) {
                    this.$message.warning('输入数字')
                    e.target.value = '0'
                }
            },
            getcls: function () {
                this.$axios.get('/getcategory')
                    .then((res) => {
                        console.log(res.data)
                        this.cls = res.data
                    })
                    .catch(function (err) {
                        console.log(err);
                    })
            }
            ,
            getgoodslist: function () {
                this.$axios.get('/getskugoodsall', {
                    params: {
                        par: this.selectcontion,
                    }
                })
                    .then((res) => {
                        console.log(res.data[0])
                        this.currData = res.data
                        this.total = this.currData.length
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            },



            ///挑选商品到购物车
            handleClick(row) {
                this.issubmit= false //修改上次提交后提交按钮的可用
                let finds = false
                let arr = []
                arr = this.Ordersinfo.order_detail
                for (let i = 0; i < arr.length; i++) {
                  //  console.log(arr.length)
                    if (arr[i].item_no === row.item_no) {
                        finds = true ///如果发现重复就不添加,直接跳出
                        console.log("发现重复商品:" + row.item_no)
                        break
                    }
                }
                if (finds === false) {
                    this.Ordersinfo.order_detail.push({

                        item_no: row.item_no,
                        orderqty: row.orderqty,
                        appointed_price: row.appointed_price,
                        item_name: row.item_name,
                        unit_no: row.unit_no,
                        item_size: row.item_size,
                        item_amt:row.appointed_price*row.orderqty
                    })

                    this.Ordersinfo.total_qty = this.Ordersinfo.total_qty + 1
                }
                console.table(this.Ordersinfo.order_detail)
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.currentPage = 1;
                this.fetchData(1, val);
               // console.log(`每页 ${val} 条`);
            },
            current_change: function (currentPage) {
                this.currentPage = currentPage;
            },
            getSummaries(param) {
              //  console.log("开始计算")
                const {columns, data} = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '总价';
                        return;
                    }
                    if(index === 5 ) {
                        const values = data.map(item => Number(item[column.property]));
                        if (!values.every(value => isNaN(value))) {
                            sums[index] = values.reduce((prev, curr) => {
                                const value = Number(curr);
                                if (!isNaN(value)) {
                                    return prev + curr;
                                } else {
                                    return prev;
                                }
                            }, 0);
                            sums[index] += ' 元';
                        } else {
                            sums[index] = '';
                        }
                    }
                });
                return sums;
            }
        }
    }
</script>
<style>
    .el-table th {
        text-align: center;
    }

    .el-table tbody tr td:first-child {
        text-align: center;
    }
    .el-row {
        margin-bottom: 10px

    }
    .el-col {
        border-radius: 4px;
    }
    .input-with-select .el-input-group__prepend {
        background-color: #fff;}
    .el-select .el-input {
        width: 130px;
    }
    .badge-item {
        margin-left: 60px;
    }
    .el-table th {
        padding: 1px 0
    }
</style>
