import type { Metadata } from 'next';
import ScrollTopButton from './scroll-top-button';

export const metadata: Metadata = {
  title: '주의 사항',
};

export default function ImportantNoticesPage() {
  return (
    <main>
      <header className="header">
        <div className="container">
          <h1 className="header-title">주의 사항</h1>
          <p className="header-subtitle">하츠네 미쿠 &lt;매지컬 미라이 2025&gt; 주의사항</p>
        </div>
      </header>

      <div className="container notice-alert">
        <a href="#id-check">라이브 티켓의 &lt;본인확인&gt; 실시에 대해서</a>
      </div>

      <nav className="container notice-nav">
        <ul>
          <li><a href="#common">공통 항목</a></li>
          <li><a href="#expo">기획전</a></li>
          <li><a href="#goods">공식 굿즈</a></li>
          <li><a href="#cosplay">코스프레</a></li>
          <li><a href="#flowers">축하 화환</a></li>
          <li><a href="#live">라이브</a></li>
          <li><a href="#photo">촬영</a></li>
        </ul>
      </nav>

      <section id="id-check" className="container notice-section">
        <div className="notice-box">
          <p className="notice-caution">반드시 읽어 주세요</p>
          <h2 className="section-title">라이브 티켓의 &lt;본인확인&gt; 실시에 대해서</h2>
          <p>
            모든 회장에서 입장 시 무작위로 본인 확인을 진행합니다. 티켓 구매 시
            개인정보 등록이 필요하며, 여러 장을 구매할 경우 동행자 정보도 함께
            입력해야 합니다.
          </p>
          <p>
            본인 확인은 신분증과 티켓의 이름을 대조하여 진행하며, 확인이 되지 않을
            경우 입장이 제한되고 환불은 불가합니다.
          </p>
          <ul className="notice-list">
            <li>사용 가능한 신분증 종류를 미리 확인해 주세요.</li>
            <li>U-18석은 학생증·보험증 등 연령 확인 서류를 지참해야 합니다.</li>
          </ul>
        </div>
      </section>

      <section id="common" className="container notice-section">
        <div className="notice-box">
          <h2 className="section-title">공통 항목</h2>
          <ul className="notice-list">
            <li>라이브 입장에는 라이브 티켓, 기획전 입장에는 기획전 티켓이 필요합니다.</li>
            <li>구매한 티켓은 개인 사정으로 환불되지 않습니다.</li>
            <li>날씨나 기타 사유로 일정이 변경되거나 취소될 수 있습니다.</li>
          </ul>
        </div>
      </section>

      <section id="expo" className="container notice-section">
        <div className="notice-box">
          <h2 className="section-title">기획전</h2>
          <p>기획전 입장에는 해당 날짜의 기획전 티켓이 필요하며, 5세 이하 어린이는 보호자 1명당 1명까지 무료입니다.</p>
        </div>
      </section>

      <section id="goods" className="container notice-section">
        <div className="notice-box">
          <h2 className="section-title">공식 굿즈</h2>
          <p>공식 굿즈는 기획전 내 판매 부스에서 구매할 수 있으며, 수량은 한정되어 있습니다.</p>
        </div>
      </section>

      <section id="cosplay" className="container notice-section">
        <div className="notice-box">
          <h2 className="section-title">코스프레</h2>
          <p>코스프레는 지정된 장소와 시간에서만 가능하며, 탈의실 이용 후 이동해주세요.</p>
        </div>
      </section>

      <section id="flowers" className="container notice-section">
        <div className="notice-box">
          <h2 className="section-title">축하 화환</h2>
          <p>축하 화환은 공식 업체를 통해서만 접수하며, 현장 반입은 불가합니다.</p>
        </div>
      </section>

      <section id="live" className="container notice-section">
        <div className="notice-box">
          <h2 className="section-title">라이브</h2>
          <p>입장 시 무작위 본인 확인을 실시합니다. 관람 중에는 지정된 좌석에서 응원해 주세요.</p>
        </div>
      </section>

      <section id="photo" className="container notice-section">
        <div className="notice-box">
          <h2 className="section-title">촬영</h2>
          <p>라이브 공연장은 촬영 및 녹음이 금지됩니다. 기획전에서도 촬영 금지 표기가 있는 구역은 촬영할 수 없습니다.</p>
        </div>
      </section>
      <ScrollTopButton />
    </main>
  );
}
