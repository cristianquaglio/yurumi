import { MainLayout } from '../../components/layouts';
import { CreateHealthcareForm } from './CreateHealthcareForm';

export const CreateHealthcarePage = () => {
    return (
        <MainLayout>
            <CreateHealthcareForm onClose={() => {}} mode='page' />
        </MainLayout>
    );
};
