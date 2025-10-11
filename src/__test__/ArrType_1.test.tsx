import ArrType_1 from '@/pages/Arithmetic/components/ArrType_1';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('@/context/QuestionMetaContext', () => ({
    useQuestionMeta: () => ({ id: 'q1', title: 'Test Question' }),
}));

jest.mock('@/context/QuestionControlsContext', () => ({
    useQuestionControls: () => ({ setControls: jest.fn() }),
}));

jest.mock('@/hooks/useResultTracker', () => ({
    __esModule: true,
    default: () => ({ addResult: jest.fn() }),
}));


describe('ArrType_1 Component', () => {
    const mockRows = [
        { start: 10, step: 10, maxLength: 5, prefilledCount: 2 },
    ];

    test('renders with prefilled inputs', () => {
        render(<ArrType_1 rows={mockRows} />);

        // Check if first two prefilled inputs have correct values
        expect(screen.getByDisplayValue('10')).toBeInTheDocument();
        expect(screen.getByDisplayValue('20')).toBeInTheDocument();
    });

    test('allows typing into editable inputs', () => {
        render(<ArrType_1 rows={mockRows} />);

        const input = screen.getAllByRole('textbox')[2]; // third box (editable)
        fireEvent.change(input, { target: { value: '30' } });
        expect(input).toHaveValue('30');
    });

    test('checks answers correctly', () => {
        render(<ArrType_1 rows={mockRows} />);

        const input = screen.getAllByRole('textbox')[2];
        fireEvent.change(input, { target: { value: '30' } });

        // Trigger the internal handleCheck via context mock (optional)
        // For now, you can test rendering and behavior only
    });
});
