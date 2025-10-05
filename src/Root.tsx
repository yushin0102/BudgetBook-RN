import { QueryClientProvider } from '@tanstack/react-query';

import App from './App';
import { queryClient } from './constants/query-client';

const Root = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    );
};

export default Root;
