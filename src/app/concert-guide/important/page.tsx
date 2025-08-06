import type { Metadata } from 'next';
import ScrollTopButton from '@/components/ScrollTopButton';
import NoticeScroll from '@/components/NoticeScroll';

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
          <li><a href="#goods">공식 굿즈 판매</a></li>
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
        <div className="notice-box info-box">
          <h2 className="section-title">공식 굿즈 판매</h2>

          <h3 className="info-subtitle">판매 시간에 대하여</h3>
          <p className="info-location">SENDAI (기획전 유료 구역 – 센다이역 앞 EBeanS 9F)</p>
          <ul className="info-list">
            <li>
              8월 1일 (금) <span>10:00~19:30 (최종 입장 19:00)</span>
            </li>
            <li>
              8월 2일 (<span className="week-sat">토</span>){' '}
              <span>10:00~19:30 (최종 입장 19:00)</span>
            </li>
            <li>
              8월 3일 (<span className="week-sun">일</span>){' '}
              <span>10:00~18:30 (최종 입장 18:00)</span>
            </li>
          </ul>
          <p className="info-note">※ 8월 3일(일)은 18:30에 종료됩니다.</p>
          <p className="info-note">
            ※ 대기열 상황에 따라 판매 종료 시간이 변경될 수 있습니다.
          </p>

          <p className="info-location">
            SENDAI (기획전 유료 구역 – 센다이 선플라자홀 1F)
          </p>
          <ul className="info-list">
            <li>
              8월 1일 (금) <span>10:00~18:30 (최종 입장 18:00)</span>
            </li>
            <li>
              8월 2일 (<span className="week-sat">토</span>){' '}
              <span>10:00~18:30 (최종 입장 18:00)</span>
            </li>
            <li>
              8월 3일 (<span className="week-sun">일</span>){' '}
              <span>10:00~18:30 (최종 입장 18:00)</span>
            </li>
          </ul>
          <p className="info-note">
            ※ 대기열 상황에 따라 판매 종료 시간이 변경될 수 있습니다.
          </p>

          <p className="info-location">OSAKA (기획전 내)</p>
          <ul className="info-list">
            <li>
              8월 9일 (<span className="week-sat">토</span>){' '}
              <span>9:00~18:00 (최종 입장 17:30)</span>
            </li>
            <li>
              8월 10일 (<span className="week-sun">일</span>){' '}
              <span>9:00~18:00 (최종 입장 17:30)</span>
            </li>
            <li>
              8월 11일 (<span className="week-sun">월・공휴일</span>){' '}
              <span>9:00~18:00 (최종 입장 17:30)</span>
            </li>
          </ul>
          <p className="info-note">
            ※ 대기열 상황에 따라 판매 종료 시간이 변경될 수 있습니다.
          </p>

          <p className="info-location">TOKYO (기획전 내)</p>
          <ul className="info-list">
            <li>
              8월 29일 (금) <span>9:00~18:00 (최종 입장 17:30)</span>
            </li>
            <li>
              8월 30일 (<span className="week-sat">토</span>){' '}
              <span>9:00~18:00 (최종 입장 17:30)</span>
            </li>
            <li>
              8월 31일 (<span className="week-sun">일</span>){' '}
              <span>9:00~18:00 (최종 입장 17:30)</span>
            </li>
          </ul>
          <p className="info-note">
            ※ 대기열 상황에 따라 판매 종료 시간이 변경될 수 있습니다.
          </p>

          <h3 className="info-subtitle">구매 제한에 대하여</h3>
          <p>
            원칙적으로,{' '}
            <span className="info-highlight">
              1인 1회 결제 당 각 상품【5개】까지
            </span>
            로 제한됩니다. 단, 아래 상품은 예외입니다.
          </p>
          <p className="info-note">
            ※ 사전 예고 없이 변경될 수 있습니다. 양해 부탁드립니다.
          </p>

          <p className="info-limit-title">
            1인 1회 결제 당 각 상품【10개】까지
          </p>
          <ul className="info-list">
            <li>
              <p>모든 랜덤 상품</p>
              <p className="info-note">
                ※ 단, 다음 상품은 제외됩니다:
                <br /> 매지컬 미라이 2025 링라이트(랜덤 6종),
                <br /> 매지컬 미라이 2025 반짝이는 손목밴드(랜덤 6종),
                <br /> 매지컬 미라이 2025 캔뱃지(랜덤 11종),
                <br /> 매지컬 미라이 2025 트레이딩 카드(랜덤 11종)
              </p>
            </li>
          </ul>

          <p className="info-limit-title">
            1인 1회 결제 당 각 상품【20개】까지
          </p>
          <ul className="info-list">
            <li>매지컬 미라이 2025 링라이트 (랜덤 6종)</li>
            <li>매지컬 미라이 2025 반짝이는 손목밴드 (랜덤 6종)</li>
            <li>매지컬 미라이 2025 캔뱃지 (랜덤 11종)</li>
            <li>매지컬 미라이 2025 트레이딩 카드 (랜덤 11종)</li>
          </ul>

          <p className="info-limit-title">
            1인 1회 결제 당 각 상품【3개】까지
          </p>
          <ul className="info-list">
            <li>매지컬 미라이 2025 머플러타월 로고 ver.</li>
            <li>
              매지컬 미라이 2025 머플러타월 미쿠 ver. / 린 ver. / 렌 ver. / 루카
              ver. / MEIKO ver. / KAITO ver.
            </li>
            <li>매지컬 미라이 2025 하피 (법피) 메인 비주얼 ver.</li>
            <li>매지컬 미라이 2025 미니 깃발</li>
            <li>매지컬 미라이 2025 캡모자</li>
          </ul>

          <p className="info-limit-title">
            1인 1회 결제 당 각 상품【2개】까지
          </p>
          <ul className="info-list">
            <li>매지컬 미라이 2025 펜라이트</li>
            <li>
              매지컬 미라이 2025 데스크매트 메인 비주얼 ver. / 서브 비주얼 ver.
            </li>
            <li>매지컬 미라이 2025 쇼핑백</li>
          </ul>

          <h3 className="info-subtitle">공식 굿즈 판매에 관하여</h3>
          <ul className="notice-list">
            <li>
              공식 굿즈 판매장이 있는 기획전에 입장하려면{' '}
              <strong>기획전 티켓</strong>이 필요합니다.
            </li>
            <li>티켓에 명시된 날짜에만 사용할 수 있습니다. 날짜를 확인하여 방문해 주세요.</li>
            <li>
              라이브 입장/시작 전까지 구매하지 못할 수도 있으니 양해 부탁드립니다.
              일부 굿즈는 상황에 따라 라이브 회장 내에서도 판매될 수 있으며, 이 경우
              공식 X(트위터:{' '}
              <a
                href="https://twitter.com/magicalmirai"
                target="_blank"
                rel="noopener noreferrer"
                className="notice-link"
              >
                @magicalmirai
              </a>
              )에 당일 공지됩니다.
            </li>
            <li>판매 수량은 한정되어 있으며, 상품에 따라 품절될 수 있습니다.</li>
            <li>
              불량품을 제외한 교환·반품은 불가합니다. 구매 전 반드시 확인해 주세요.
              불량품은 구입 장소의 스태프에게 문의해 주세요.
            </li>
            <li>
              상품 본체와 관련 없는 포장지, 대지, 포장 자재 등의 상처·오염·파손은
              교환/반품 대상이 아닙니다.
            </li>
            <li>트러블 방지를 위해 전날 밤이나 심야 시간부터 줄 서는 것은 삼가 주세요.</li>
            <li>
              <p>공식 굿즈 판매에서는 아래 결제 수단을 사용할 수 있습니다.</p>
              <ul className="info-sublist">
                <li>현금</li>
                <li>
                  신용카드 (VISA / MasterCard / JCB / American Express / Diners Club /
                  Discover 카드)
                </li>
                <li>전자머니 (교통계 IC카드)</li>
                <li>QR 코드 결제 (au PAY / d결제 / 라쿠텐페이 / PayPay / ALIPAY / WeChat Pay)</li>
              </ul>
              <p className="info-note">※ 통신 상태 등에 따라 사용이 불가능할 수 있습니다.</p>
              <p className="info-note">※ 현금 결제와의 병행 사용은 불가능합니다.</p>
              <p className="info-note">※ 회장 내에서 IC카드 충전은 할 수 없습니다.</p>
            </li>
            <li>구매한 상품과 결제 내용은 결제 시 반드시 확인해 주세요.</li>
            <li>상품 예약, 주문 제작, 배송 서비스는 제공되지 않습니다.</li>
            <li>혼잡 완화를 위해 구매 후 장소에 머무르거나 다른 고객과의 물물교환은 삼가 주세요.</li>
            <li>
              랜덤 상품은 판매원이 무작위로 선택하며, 그 자리에서 내용 확인은 하지 않습니다.
              전 종류를 구매하더라도 모두 모이지 않을 수 있습니다.
            </li>
            <li>재고는 일자별로 준비되며, 공연별로 따로 보관하지 않습니다.</li>
            <li>
              <p>회장에 따라 판매되는 상품이 다를 수 있습니다.</p>
              <p className="info-note">※ 취급 상품은 각 회장의 굿즈 부스에서 확인해 주세요.</p>
            </li>
          </ul>
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
      <footer className="container notice-source">
        <p>
          출처:{' '}
          <a
            href="https://magicalmirai.com/2025/info_important.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            매지컬 미라이 2025 공식 웹사이트
          </a>
        </p>
      </footer>
      <ScrollTopButton />
      <NoticeScroll />
    </main>
  );
}
