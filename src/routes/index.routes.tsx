import MainPageLayout from '@/layouts/MainPageLayout'
import ArithmeticPage from '@/pages/Arithmetic/ArithmeticPage'
import GroupPage from '@/pages/Group/GroupPage'
import LanguagePage from '@/pages/Language/LanguagePage'
import LoginPage from '@/pages/Login/LoginPage'
import ReadingPage from '@/pages/Reading/ReadingPage'
import ResultPage from '@/pages/Result/ResultPage'
import SpellingPage from '@/pages/Spelling/SpellingPage'
import SubjectPage from '@/pages/Subject/SubjectPage'
import VocabularyPage from '@/pages/Vocabulary/VocabularyPage'
import WelcomePage from '@/pages/Welcome/WelcomePage'
import { createBrowserRouter } from 'react-router'
import CategoryPage from '@/pages/Category/CategoryPage'
import SubCategoryPage from '@/pages/SubCategory/SubCategoryPage'

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
                path: "/group/subject",
                Component: SubjectPage
            },
            {
                path: "/group/subject/category",
                Component: CategoryPage
            },
            {
                path: "/group/subject/category/subcategory",
                Component: SubCategoryPage
            },
            {
                path: "/group/subject/category/arithmetic",
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
    }
])
