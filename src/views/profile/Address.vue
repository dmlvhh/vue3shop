<template>
  <div class="address-box">
    <nav-bar class="nav-bar">
      <template v-slot:default>地址管理</template>
    </nav-bar>

    <div
            v-show="list.length == '0'"
            style="margin-top: 200px; text-align: center"
    >
      还没有地址信息，去添加吧！
    </div>

    <div class="address-item">
      <van-address-list
              v-model="chosenAddressId"
              :list="list"
              default-tag-text="默认"
              @add="onAdd"
              @edit="onEdit"

      />
    </div>

  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";
  import { ref , toRefs, reactive , onMounted,onActivated } from 'vue';
  import { Toast } from 'vant';
  import { useRouter } from 'vue-router';
  import { addAddress, EditAddress, DeleteAddress, getAddressDetail,addressList } from "network/address";

  export default {
    name: "Address",
    setup() {
      const router = useRouter();
      const state = reactive({
        chosenAddressId: '1',
        list : []
      })

      const onAdd = () => {
        router.push({ path: "/editaddress",query:{ type: "add"}});
      };
      const onEdit = (item) => {
        router.push({
          path: "/editaddress",
          query: { type: 'edit', addressId: item.id },
        })
      }

      onMounted(() => {

        Toast.loading({message:'加载中...',forbidClick:true});

        addressList().then((res) => {
          if (res.data.length == '0') {
            state.list = [];
            return;
          }
          state.list = res.data.map(item => {

            return {
              id: item.id,
              name: item.name,
              tel: item.phone,
              // 省市县地址信息保存到一个变量address中
              address: `${item.province} ${item.city} ${item.county} ${item.address}`,
              // 判断是否为默认地址
              isDefault: !!item.is_default,
            }

          })
        })
      })

      return {
         onAdd, onEdit , router,...toRefs(state)
      }
    },
    components: {
      NavBar
    }
  }
</script>

<style lang="scss">

  .address-box {
    height: 300px;
    .van-radio__icon {
      display: block;
      color: #42b983;
      /*.van-radio__icon--checked {*/
      /*  color: #42b983;*/
      /*}*/
    }
    .address-item {
      margin-top: 45px;
      .van-button {
        background: var(--color-tint);
        border-color: var(--color-tint);
      }
    }
  }
  .van-address-list__bottom {
    bottom: 200px !important;
    --van-background-color-light: none;

  }
   .van-safe-area-bottom {
     border: none !important;
   }

</style>