const Setting = () => {
	return (
		<div className="bg-white dark:bg-gray-700 p-6 rounded shadow">
		<h2 className="text-xl font-semibold mb-4">Settings</h2>
		<div className="space-y-4">
			<div><label className="block font-medium">Dark Mode</label><p className="text-sm text-gray-400">Enable dark theme.</p></div>
			<div><label className="block font-medium">Notifications</label><p className="text-sm text-gray-400">Get reminders for payments.</p></div>
		</div>
		</div>
	)
}

export default Setting
