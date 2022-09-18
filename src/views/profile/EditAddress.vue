<template>
  <div>
    <NavBar>
      <template v-slot:default>{{title}}</template>
    </NavBar>

    <div>
      <van-address-edit
              class="edit"
              :area-list="areaList"
              :show-delete="type == 'edit'"
              show-set-default
              show-search-result
              :search-result="searchResult"
              :area-columns-placeholder="['请选择', '请选择', '请选择']"
              @save="onSave"
              @delete="onDelete"
              :address-info	="addressInfo"
      />
    </div>
  </div>
</template>

<script>

  import { Toast } from 'vant';
  import { reactive, onMounted ,toRefs, computed } from "vue";
  import NavBar from "components/common/navbar/NavBar";
  import { addAddress, editAddress, deleteAddress, addressDetail } from "network/address";
  import { tdist } from 'utils/address'
  import { useRoute, useRouter } from "vue-router";

  export default {
    setup() {
      const route = useRoute();
      const router = useRouter();
      const state = reactive({
        areaList: {
          province_list: {},
          city_list: {},
          county_list: {}
        },
        searchResult: [],
        addressInfo: {},
        type:'add',
        addressId:' ',
        title:''
      })

      onMounted(() => {
        // 构造省市区列表
        let _province_list = {};
        let _city_list = {};
        let _county_list = {};
        //遍历所有 省数据
        tdist.getLev1().forEach(p => {
          // 把 省 的id拿出来
          _province_list[p.id] = p.text;
          // 遍历所有 市数据
          tdist.getLev2(p.id).forEach(c => {
            _city_list[c.id] = c.text;
            // 遍历所有 县数据
            tdist.getLev3(c.id).forEach(q => {
              _county_list[q.id] = q.text;
            })
          })
        })

        state.areaList.province_list = _province_list;
        state.areaList.city_list = _city_list;
        state.areaList.county_list = _county_list;
        // 接收是否是跳转过来编辑还是新增地址参数query
        const {type,addressId} = route.query;
        state.type = type;
        state.addressId = addressId;

        if (type == 'edit') {

        // 显示编辑地址栏上的地址信息
          addressDetail(addressId).then((res) => {

            const addressdetail = res;

            // 定义一个空的区域码
            let _areaCode = "";
            // 省份
            const province = tdist.getLev1();
            // Object中entries属性可以拿到键和值
            // 区-市-省，反着拿

            // console.log(Object.entries(state.areaList.county_list));
            Object.entries(state.areaList.county_list).forEach(([id, text]) => {
           // 先找出当前对应的区
           if (text == addressdetail.county) {
             // 找到区对应的几个省份
             const provinceIndex = province.findIndex(item => item.id.substr(0, 2) == id.substr(0, 2))
             // 找到区对应的几个市区
             // eslint-disable-next-line no-unused-vars
             const cityItem = Object.entries(state.areaList.city_list).filter(([cityId, city]) => cityId.substr(0, 4) == id.substr(0, 4))[0]
             // 对比找到的省份和接口返回的省份是否相等，因为有一些区会重名
             if (province[provinceIndex].text == addressdetail.province && cityItem[1] == addressdetail.city) {
               _areaCode = id
             }
           }
         })
            // 显示编辑地址栏上的地址信息,把从数据库中查出的数据放到页面中
            state.addressInfo = {
              name:addressdetail.name,
              tel:addressdetail.phone,
              province:addressdetail.province,
              city:addressdetail.city,
              county:addressdetail.county,
              areaCode: _areaCode, //区域码
              addressDetail:addressdetail.address,
              isDefault:!!addressdetail.is_default,
            }
          })
        }


      })

      // 通过计算属性来判断切换新增和编辑页面
      const title =  computed(() => {
        return state.type == "add" ? "新增地址" : "编辑地址";
      })

      // 保存表单地址信息并请求传给添加地址接口
      const onSave = (content) => {
        const params = {
          name:content.name,
          address:content.addressDetail,
          phone:content.tel,
          province:content.province,
          city:content.city,
          county:content.county,
          is_default:content.isDefault ? 1 : 0,
        }

        // 修改地址信息后判断一下是编辑操作而不是新增操作
        // 如果类型为 编辑 状态
        if (state.type == "edit") {

          // 调用 修改数据接口
          editAddress(state.addressId, params); // params传递修改好的数据
        } else if (state.type == "add") {

          // 调用 添加数据接口
          addAddress(params);
        }
        setTimeout(() => {
          Toast('保存成功');
          router.push({path:"/address"})
        },1000)
      };


      // 调用删除地址
      const onDelete = () => {
        deleteAddress(state.addressId).then((res) => {
          setTimeout(() => {
            Toast('删除成功');
            router.push({path:"/address"})
          },1000)
        })
      };

      return {
        onSave,
        onDelete,
        ...toRefs(state),
        title,
      };
    },
    components: {
      NavBar
    }
  };
</script>

<style lang="scss">
  .edit {
    margin-top: 45px;
    .van-field__body {
        textarea {
          height: 26px !important;
        }
    }
  }
  .address-edit-box {
      margin-top: 60px;
    .van-address-edit {

      .van-switch--on {
        background: var(--color-tint);
      }
    }
  }
  .van-button--danger {
    --van-button-danger-background-color:var(--color-tint);
    --van-button-danger-border-color:var(--color-tint);
  }
  .van-switch--on {
    --van-switch-on-background-color:var(--color-tint);
  }


</style>