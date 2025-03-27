<script>
	export default {
		onLaunch: function() {
			// console.log('App Launch')
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
