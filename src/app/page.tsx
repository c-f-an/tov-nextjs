import { MainBanner } from "@/presentation/components/home/MainBanner";
import { QuickLinks } from "@/presentation/components/home/QuickLinks";
import { LatestNews } from "@/presentation/components/home/LatestNews";
import { TovActivities } from "@/presentation/components/home/TovActivities";
import { ConsultationBanner } from "@/presentation/components/home/ConsultationBanner";
import { FinancialReport } from "@/presentation/components/home/FinancialReport";
import { getContainer } from "@/infrastructure/config/getContainer";

// Force dynamic rendering to ensure DB queries run at runtime
export const dynamic = "force-dynamic";

export default async function Home() {
  let banners: any[] = [];
  let categories: any[] = [];
  let notices: any[] = [];
  let latestNews: any[] = [];
  let quickLinks: any[] = [];
  let consultationStats = null;
  let financialReport = null;

  // Skip database queries during build
  if (process.env.SKIP_DB_QUERIES !== "true") {
    // Fetch main banners from database
    const container = getContainer();
    const getMainBannersUseCase = container.getGetMainBannersUseCase();
    const bannersResult = await getMainBannersUseCase.execute({
      activeOnly: true,
    });
    banners = bannersResult.ok
      ? bannersResult.value.map((banner) => ({
          ...banner,
          createdAt: banner.createdAt?.toISOString() || null,
          updatedAt: banner.updatedAt?.toISOString() || null,
          startDate: banner.startDate?.toISOString() || null,
          endDate: banner.endDate?.toISOString() || null,
        }))
      : [];

    // Fetch categories
    const getCategoriesUseCase = container.getGetCategoriesUseCase();
    const categoriesResult = await getCategoriesUseCase.execute();
    categories = Array.isArray(categoriesResult) ? categoriesResult : [];

    // Find notice category ID
    const noticeCategory = categories.find((cat) => cat.slug === "notice");

    // Fetch latest posts
    const getPostsUseCase = container.getGetPostsUseCase();

    // Fetch latest notices
    const noticesResult = noticeCategory
      ? await getPostsUseCase.execute({
          categoryId: noticeCategory.id,
          limit: 4,
          page: 1,
        })
      : null;
    notices = noticesResult?.posts
      ? noticesResult.posts.map((post: any) => ({
          ...post,
          createdAt: post.createdAt?.toISOString() || null,
          updatedAt: post.updatedAt?.toISOString() || null,
          publishedAt: post.publishedAt?.toISOString() || null,
        }))
      : [];

    // Fetch quick links
    const getQuickLinksUseCase = container.getGetQuickLinksUseCase();
    const quickLinksResult = await getQuickLinksUseCase.execute({
      activeOnly: true,
    });
    quickLinks = quickLinksResult.ok
      ? quickLinksResult.value.map((link) => ({
          ...link,
          createdAt: link.createdAt?.toISOString() || null,
          updatedAt: link.updatedAt?.toISOString() || null,
        }))
      : [];

    // Fetch consultation stats
    const getConsultationStatsUseCase =
      container.getGetConsultationStatsUseCase();
    const statsResult = await getConsultationStatsUseCase.execute();
    consultationStats = statsResult.ok ? statsResult.value : null;

    // Fetch latest financial report
    const getLatestFinancialReportUseCase =
      container.getGetLatestFinancialReportUseCase();
    const reportResult = await getLatestFinancialReportUseCase.execute();
    financialReport = reportResult.ok ? reportResult.value : null;

    // Fetch latest news from posts table (최신 게시물 3개)
    try {
      const allPostsResult = await getPostsUseCase.execute({
        limit: 3,
        page: 1,
        status: 'published',
      });
      latestNews = allPostsResult?.posts
        ? allPostsResult.posts.map((post: any) => ({
            id: post.id,
            title: post.title,
            content: post.content,
            summary: post.summary || "",
            category: post.category?.slug || "news",
            imageUrl: post.imageUrl || null,
            author: post.author?.username || "관리자",
            views: post.views || 0,
            status: post.status,
            isPublished: post.isPublished,
            createdAt: post.createdAt?.toISOString() || null,
            updatedAt: post.updatedAt?.toISOString() || null,
            publishedAt: post.publishedAt?.toISOString() || null,
          }))
        : [];
    } catch (error) {
      console.error("Error fetching latest posts:", error);
    }
  }

  return (
    <>
      <h1 className="sr-only">사단법인 토브협회 | 비영리 재정 투명성 플랫폼</h1>
      {/* Main Banner */}
      <MainBanner banners={banners} />

      {/* Quick Links */}
      <QuickLinks links={quickLinks} />

      {/* Latest News & Notice */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <LatestNews notices={notices} news={[]} latestNews={latestNews} />
        </div>
      </section>

      {/* Tov Activities */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <TovActivities />
        </div>
      </section>

      {/* Government Organization Links */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-gray-600 text-sm font-medium mb-8">
            관련 기관
          </h2>
          <div className="flex justify-center items-center gap-12">
            <a
              href="https://www.moef.go.kr/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-center">
                <img
                  src="/ministry_of_strategy_and_finance_logo.jpg"
                  alt="기획재정부"
                  className="h-14 object-contain"
                />
              </div>
            </a>
            <a
              href="https://www.nts.go.kr/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-center">
                <img
                  src="/national_tax_service_logo.jpg"
                  alt="국세청"
                  className="h-14 object-contain"
                />
              </div>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
