import { json } from '@remix-run/node';

export const action = async ({ request }) => {
    const formData = await request.formData();
    const paymentDetails = JSON.parse(formData.get('paymentDetails'));
    const selectedPlan = formData.get('selectedPlan');

    console.log('Payment details submitted', paymentDetails);
    console.log('Selected plan:', selectedPlan);

    return json({ message: 'Payment submitted successfully', plan: selectedPlan });
};
