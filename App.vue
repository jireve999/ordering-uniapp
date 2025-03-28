<script lang="ts">
	import { defineComponent} from "vue";
	import { useStore } from "vuex";
	export default {
		onLaunch: function() {
			let store = useStore(); // 启用vuex
			uni.getSystemInfo({
				success: (res: any) => {
					let name = 'iPhone X';
					if (res.deviceModel.indexOf(name) > -1) { // 如果在iPhoneX
						store.commit("system/SET_IPX", {isIpx: true});

					}
				}
			});
		},
		onShow: function() {
			// console.log('App Show')
		},
		onHide: function() {
			// console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	button, input, button:after{
		border: 0 none;
		outline: none;
		border-radius: 0;
	}
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}
</style>
