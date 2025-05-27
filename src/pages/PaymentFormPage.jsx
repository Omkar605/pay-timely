import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const frequencies = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

function calculateNextDue(startDate, frequency) {
	const date = new Date(startDate);
	switch (frequency) {
		case 'Daily':
			date.setDate(date.getDate() + 1);
			break;
		case 'Weekly':
			date.setDate(date.getDate() + 7);
			break;
		case 'Monthly':
			date.setMonth(date.getMonth() + 1);
			break;
		case 'Yearly':
			date.setFullYear(date.getFullYear() + 1);
			break;
	}
	return date.toISOString().split('T')[0];
}

function PaymentFormPage() {
	const { id } = useParams();
	const isEditMode = !!id;
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		title: '',
		amount: '',
		startDate: '',
		frequency: 'Monthly',
		notify: false,
	});

	useEffect(() => {
		if (isEditMode) {
			// Fetch existing payment info (mocked for now)
			const existing = {
				title: 'Netflix',
				amount: 499,
				startDate: '2025-05-20',
				frequency: 'Monthly',
				notify: true,
			};
			setFormData(existing);
		}
	}, [id]);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const nextDue = calculateNextDue(formData.startDate, formData.frequency);

		const payload = {
			...formData,
			amount: parseFloat(formData.amount),
			nextDue,
		};

		if (isEditMode) {
			console.log('Updated:', payload);
		} else {
			console.log('Created:', payload);
		}

		navigate('/');
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-900 to-slate-900 flex items-center justify-center px-4">
			<div className="bg-white p-8 rounded-2xl shadow-lg max-w-xl w-full">
				<h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
					{isEditMode ? 'Edit Payment' : 'Add New Payment'}
				</h1>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block mb-1 text-sm font-medium text-gray-700">Title</label>
						<input
							name="title"
							type="text"
							required
							value={formData.title}
							onChange={handleChange}
							className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
							placeholder="e.g. Netflix"
						/>
					</div>

					<div>
						<label className="block mb-1 text-sm font-medium text-gray-700">Amount (₹)</label>
						<input
							name="amount"
							type="number"
							required
							value={formData.amount}
							onChange={handleChange}
							className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
							placeholder="e.g. 499"
						/>
					</div>

					<div>
						<label className="block mb-1 text-sm font-medium text-gray-700">Start Date</label>
						<input
							name="startDate"
							type="date"
							required
							value={formData.startDate}
							onChange={handleChange}
							className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div>
						<label className="block mb-1 text-sm font-medium text-gray-700">Frequency</label>
						<select
							name="frequency"
							value={formData.frequency}
							onChange={handleChange}
							className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
						>
							{frequencies.map((f) => (
								<option key={f} value={f}>
									{f}
								</option>
							))}
						</select>
					</div>

					<div className="flex items-center space-x-2">
						<input
							name="notify"
							type="checkbox"
							checked={formData.notify}
							onChange={handleChange}
							className="accent-blue-600"
						/>
						<label className="text-sm text-gray-700">Enable Notifications</label>
					</div>

					<div className="flex space-x-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {isEditMode ? 'Update Payment' : 'Add Payment'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>

	</form>
	</div>
	</div>
	);
}

export default PaymentFormPage;
