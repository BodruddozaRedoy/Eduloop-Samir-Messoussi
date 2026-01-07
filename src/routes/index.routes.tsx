import AdminLayout from '@/layouts/AdminLayout';
import MainPageLayout from '@/layouts/MainPageLayout';
import { AdminIndexRedirect, AdminProtectedLayout, AdminPublicOnlyLayout } from '@/pages/admin/AdminGuards';
import AdminDashboard from '@/pages/admin/dashboard/AdminDashboard';
import AdminLogin from '@/pages/admin/login/AdminLogin';
import AdminQeustions from '@/pages/admin/questions/AdminQeustions';
import AdminCreateToken from '@/pages/admin/tokens/AdminCreateToken';
import AdminAddUsers from '@/pages/admin/users/AdminAddUsers';
import ArithmeticPage from '@/pages/Arithmetic/ArithmeticPage';
import CategoryPage from '@/pages/Category/CategoryPage';
import GroupPage from '@/pages/Group/GroupPage';
import LanguagePage from '@/pages/Language/LanguagePage';
import LoginPage from '@/pages/Login/LoginPage';
import ReadingPage from '@/pages/Reading/ReadingPage';
import ResultPage from '@/pages/Result/ResultPage';
import SpellingPage from '@/pages/Spelling/SpellingPage';
import SubCategoryPage from '@/pages/SubCategory/SubCategoryPage';
import SubjectPage from '@/pages/Subject/SubjectPage';
import VocabularyPage from '@/pages/Vocabulary/VocabularyPage';
import WelcomePage from '@/pages/Welcome/WelcomePage';
import { createBrowserRouter } from 'react-router';

export const router = createBrowserRouter([
    {
        path: "/",
        Component: MainPageLayout,
        children: [
            {
                path: "/",
                Component: WelcomePage
            },
            {
                path: '/login',
                Component: LoginPage
            },
            {
                path: "/group",
                Component: GroupPage,
            },
            {
                path: "/subject",
                Component: SubjectPage
            },
            {
                path: "/category",
                Component: CategoryPage
            },
            {
                path: "/group/subject/category/subcategory",
                Component: SubCategoryPage
            },
            {
                path: "/arithmetic",
                Component: ArithmeticPage
            },
            {
                path: "/reading",
                Component: ReadingPage
            },
            {
                path: "/spelling",
                Component: SpellingPage
            },
            {
                path: "/vocabulary",
                Component: VocabularyPage
            },
            {
                path: "/language",
                Component: LanguagePage
            },
            {
                path: "/result",
                Component: ResultPage
            }

        ]
    },
    {
    path: "admin",
    Component: AdminLayout,
    children: [
        {
            index: true,
            Component: AdminIndexRedirect,
        },
        {
            Component: AdminPublicOnlyLayout,
            children: [
                {
                    path: 'login',
                    Component: AdminLogin
                },
            ]
        },
        {
            Component: AdminProtectedLayout,
            children: [
                {
                    path: 'dashboard',
                    Component: AdminDashboard
                },
                {
                    path: 'questions',
                    Component: AdminQeustions
                },
                {
                    path: 'tokens',
                    Component: AdminCreateToken
                },
                {
                    path: 'users',
                    Component: AdminAddUsers
                },
            ]
        },
    ]
    }
]);
