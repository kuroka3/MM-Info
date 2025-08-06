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
        <div className="notice-box info-box">
          <h2 className="section-title">기획전</h2>

          <h3 className="info-subtitle">기획전 티켓 안내</h3>
          <ul className="notice-list">
            <li>기획전의 입장에는 “기획전 티켓”이 필요합니다.</li>
            <li>티켓에 기재된 일정에만 사용 가능합니다. 착오 없으시길 바랍니다.</li>
            <li>
              티켓 구매 시 개인 정보를 등록하셔야 합니다. 또한, 여러 장 구매 시에는
              동반자의 개인 정보도 등록해 주십시오. 협조 감사합니다.
            </li>
            <li>
              티켓 소지 보호자 1명당 5세 이하 아동 1명까지 무료 동반 가능합니다.
              아동 연령 확인을 위해 보험증 등 연령 확인이 가능한 증명서를
              지참해 주십시오.
            </li>
          </ul>

          <h3 className="info-subtitle">당일권 판매 안내</h3>
          <ul className="notice-list">
            <li>“기획전 티켓”은 현장에서도 판매합니다.</li>
            <li>티켓은 구매 당일에만 유효합니다.</li>
            <li>
              <p>매일 13:00부터 “당일권 판매소”에서 판매할 예정입니다.</p>
              <p className="info-note">
                ※ 당일 입장 상황에 따라 판매 시작 시간이 변경될 수 있습니다. 양해
                부탁드립니다.
              </p>
              <p className="info-note">
                ※ 판매 시작 30분 전에는 대기줄에 합류할 수 없습니다. 양해
                부탁드립니다.
              </p>
              <p className="info-note">
                ※ 판매 매수는 예매 상황 및 당일 입장 상황에 따라 변동될 수
                있습니다.
              </p>
              <p className="info-note">※ 예정 수량 소진 시 판매가 종료됩니다.</p>
              <p className="info-note">
                ※ 회장 혼잡 상황에 따라 판매를 일시 중단하거나 종료할 수 있습니다.
              </p>
              <p className="info-note">
                ※ 당일권 판매 시간 및 당일 입장 상황에 따라 입장 시간이 지연될 수
                있습니다.
              </p>
              <p className="info-note br_t_s">
                자세한 내용은 각 회장 티켓 정보 페이지에서 확인해 주십시오. 확정되는
                대로 순차 발표합니다.
              </p>
              <p>
                <a
                  href="https://magicalmirai.com/2025/sendai_ticket.html#ticket_ex"
                  className="notice-link"
                >
                  SENDAI 기획전 티켓 상세
                </a>
              </p>
              <p>
                <a
                  href="https://magicalmirai.com/2025/osaka_ticket.html#ticket_ex"
                  className="notice-link"
                >
                  OSAKA 기획전 티켓 상세
                </a>
              </p>
              <p>
                <a
                  href="https://magicalmirai.com/2025/tokyo_ticket.html#ticket_ex"
                  className="notice-link"
                >
                  TOKYO 기획전 티켓 상세
                </a>
              </p>
            </li>
          </ul>

          <h3 className="info-subtitle">입장 안내 (SENDAI)</h3>
          <ul className="notice-list">
            <li>
              <p>
                SENDAI 기획전는 여러 장소에서 개최되며, 유료 구역과 무료 구역으로
                나뉩니다.
                <br />구역 상세는{' '}
                <a href="sendai_map.html" className="notice-link">
                  SENDAI 회장 MAP
                </a>
                에서 확인해 주십시오.
              </p>
            </li>
            <li>
              유료 구역 입장에는 리스트 밴드가 필요합니다. “기획전 티켓 확인소”에서
              티켓 확인 시 수령하실 수 있으니, 먼저 교환을 완료해 주십시오.
            </li>
            <li>티켓만으로는 입장할 수 없습니다.</li>
            <li>
              <p>“기획전 티켓 확인소” 접수 시간은 회장별로 다릅니다.</p>
              <p className="info-note txt_back txts_s txt_em br_t_s">
                기획전 티켓 확인소
              </p>
              <p>AER 2F 아트리움</p>
              <ul className="info-list">
                <li>8월 1일(금), 8월 2일(토) <span>9:00～19:00</span></li>
                <li>8월 3일(일) <span>9:00～18:00</span></li>
              </ul>
              <p className="br_t_ss">仙台駅前イービーンズ 2F</p>
              <ul className="info-list">
                <li>8월 1일(금), 8월 2일(토) <span>13:00～19:00</span></li>
                <li>8월 3일(일) <span>13:00～18:00</span></li>
              </ul>
              <p className="br_t_ss">仙台サンプラザホール</p>
              <ul className="info-list">
                <li>8월 1일(금)～8월 3일(일) <span>13:00～18:00</span></li>
              </ul>
              <p className="info-note br_t_s">
                ※ 13:00 이전에 유료 구역 입장을 원하시는 분은 반드시 먼저 “AER 2F
                아트리움”으로 와 주십시오.
              </p>
            </li>
            <li className="br_t_s">
              “기획전 티켓 확인소”에서는 티켓 확인 후 리스트 밴드, 입장 특전,
              스탬프 랠리 대지를 수령할 수 있습니다(소진 시 종료).
            </li>
            <li>
              유료 구역은 당일 리스트 밴드 소지 시 몇 번이든 입장 가능합니다.
              <br />반드시 “기획전 티켓 확인소”에서 밴드를 수령하신 후 입장해 주십시오.
            </li>
            <li>리스트 밴드를 분실하시면 다른 유료 구역 입장이 불가하니 주의해 주십시오.</li>
            <li>각 회장에서는 혼잡 상황에 따라 입장 제한을 실시할 수 있으니 협조 부탁드립니다.</li>
          </ul>

          <h3 className="info-subtitle">입장·재입장 안내 (OSAKA·TOKYO)</h3>
          <ul className="notice-list">
            <li>
              “기획전 티켓 확인소”에서 티켓 확인 후 리스트 밴드와 입장 특전을
              수령하실 수 있습니다(입장 특전 소진 시 종료).
            </li>
            <li>리스트 밴드를 분실하시면 재입장이 불가하니 주의해 주십시오.</li>
            <li>재입장 시 재입장구를 이용하시고, 리스트 밴드를 스태프에게 제시해 주십시오.</li>
            <li>입장구 및 재입장구에서는 혼잡 상황에 따라 입장 제한이 있을 수 있으니 협조 부탁드립니다.</li>
          </ul>

          <h3 className="info-subtitle">퇴장 안내 (SENDAI·OSAKA·TOKYO)</h3>
          <ul className="notice-list">
            <li>퇴장 시에는 지정된 퇴장구 또는 스태프 안내·유도 퇴장구를 이용해 주십시오.</li>
          </ul>
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
        <div className="notice-box info-box">
          <h2 className="section-title">축하 화환</h2>

          <h3 className="info-subtitle">축하 화환에 대하여</h3>
          <ul className="notice-list">
            <li>
              <p>
                하츠네 미쿠 「매지컬 미라이 2025」 공연장 앞의 축하 화환은,
                “Start Flowers”에서 취급하는 공식 플라워 스탠드만 접수합니다.
              </p>
              <p>자세한 내용은 “Start Flowers” 특설 사이트를 확인해 주십시오.</p>
              <p className="info-note br_t_ss">
                <a
                  href="https://startflowers.com/miku/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="notice-link"
                >
                  “Start Flowers” 특설 사이트
                </a>
              </p>
              <ul className="info-sublist">
                <li className="info-note">
                  “Start Flowers” 신청 접수는 일본어로만 대응합니다.
                </li>
                <li className="info-note">
                  설치 공간이 한정되어 있어, 수량 한정 선착순 예약 판매를
                  예정하고 있습니다.
                </li>
                <li className="info-note">기업 고객은 별도 상담해 주십시오.</li>
              </ul>
            </li>
          </ul>
        </div>
      </section>

      <section id="live" className="container notice-section">
        <div className="notice-box info-box">
          <h2 className="section-title">라이브</h2>

          <h3 className="info-subtitle">라이브 티켓 안내</h3>
          <ul className="notice-list">
            <li>
              각 공연마다 「라이브 티켓(전석 지정)」이 필요합니다. 티켓에 기재된
              주의사항을 잘 읽고, 회장 내 스태프의 지시에 따라 주십시오.
            </li>
            <li>
              1인당 티켓 1매가 필요합니다. 다만, 착석 지정석의 경우 보호자 1명당
              무릎 위 관람 시에 한해 5세 이하 어린이 1명까지 무료 동반이
              가능합니다. 또한, 어린이의 연령 확인을 위해 보험증 등 나이를
              확인할 수 있는 증명서를 지참해 주시기 바랍니다.
            </li>
            <li>
              라이브 티켓의 반권(입장일 및 좌석 번호가 기재된 것)은 개최일로부터
              1개월간 반드시 보관해 주시기 바랍니다.
            </li>
            <li>당일 회장에서는 라이브 티켓 판매를 진행하지 않습니다.</li>
            <li>
              티켓 구매 시 개인 정보 등록이 필요합니다. 또한, 티켓을 여러 장
              구매하실 경우 동반자의 개인 정보도 등록해 주십시오. 협조
              부탁드립니다.
            </li>
          </ul>

          <h3 className="info-subtitle">입장・재입장 안내</h3>
          <ul className="notice-list">
            <li>
              <p>전 회장에서 라이브 입장 시 무작위로 「본인 확인」을 실시합니다.</p>
              <p>
                <a href="#id-check" className="notice-link">
                  자세히 보기
                </a>
              </p>
            </li>
            <li>좌석 번호별로 시차 입장을 요청드릴 수 있습니다. 협조 부탁드립니다.</li>
            <li>
              당일 준비 사정 등으로 개장・개연 시간이 변경될 경우 회장 내
              스태프나 안내 방송을 통해 알려드리지만, 여유 있게 도착해 주시기
              바랍니다.
            </li>
            <li>
              기본적으로 재입장은 불가합니다. 부득이한 사정이 있을 경우 입구
              스태프에게 문의해 주십시오.
            </li>
          </ul>

          <h3 className="info-subtitle">U-18석(낮 공연)의 입장 안내</h3>
          <ul className="notice-list">
            <li>
              입장 시 18세 이하임을 확인할 수 있는 신분증(학생증/보험증/기타
              나이를 확인할 수 있는 증명서)을 반드시 지참해 주십시오. 확인이
              불가능한 경우 입장이 거부될 수 있습니다. 미리 양해 바랍니다.
            </li>
          </ul>

          <h3 className="info-subtitle">대기・관람 안내</h3>
          <ul className="notice-list">
            <li>
              주변 관객의 시야를 가릴 수 있는 모자나 장식물 착용, 응원용 소품
              사용은 자제해 주십시오.
            </li>
            <li>
              펜라이트 이외의 응원용 소품은 흔들지 마십시오. 규정 내 링라이트
              착용은 가능합니다.
            </li>
            <li>
              펜라이트를 과도하게 흔들 경우 주변 관객에게 불편을 줄 수 있으니
              주의해 주십시오. 또한 다른 분의 시야를 가리지 않도록 응원 시
              주변을 배려해 주십시오.
            </li>
            <li>응원은 본인 좌석 공간 내에서 해 주십시오.</li>
            <li>티켓을 확인한 후 본인 좌석 위치에서 관람해 주십시오.</li>
            <li>
              회장 내에서는 고음량의 연주와 조명 깜빡임이 있습니다.
              <br />저연령 어린이 및 건강에 불안이 있는 분은 각별히 주의해 주시기
              바랍니다.
            </li>
            <li>점프, 의자 위에서 서서 관람, 발판(개인 반입) 사용 등 행위는 금지입니다.</li>
            <li>라이브는 약 2시간 예정입니다.</li>
          </ul>

          <h3 className="info-subtitle">퇴장 안내</h3>
          <ul className="notice-list">
            <li>
              공연 종료 후 퇴장 통로의 혼잡 완화를 위해 통제 퇴장을 실시합니다.
              스태프가 순차적으로 안내할 예정이니 본인 좌석에서 기다려 주십시오.
              또한 순서대로 퇴장 통로를 이동하므로 출구까지 시간이 소요될 수
              있습니다. 뛰거나 밀지 말고 순차적으로 퇴장해 주시기 바랍니다.
            </li>
          </ul>

          <h3 className="info-subtitle">펜라이트 안내</h3>
          <ul className="notice-list">
            <li>라이브 중 흔들 수 있는 펜라이트는 1인당 손당 1개씩, 총 2개까지입니다.</li>
            <li>
              <p>
                특수 펜라이트(길이 25cm 이상, 발광량이 많은 것, 자작・개조된 것)나
                유도등 등 배터리, 전구, LED를 사용한 발광 장치는 주변 관객에게
                불편 및 부상 등의 문제를 야기하거나 라이브 연출 효과·운영에
                지장을 줄 수 있으므로 회장 내 사용 시 크기·사양의 규제를
                실시합니다.
              </p>
              <p className="info-note">
                ※ 모든 관객이 라이브를 쾌적하게 즐기실 수 있도록 이해와 협조
                부탁드립니다.
              </p>
              <p className="info-note">
                ※ 또한 과도하게 흔들 경우 주변 관객에게 불편을 줄 수 있으니 주의해
                주십시오.
              </p>
            </li>
          </ul>

          <h3 className="info-subtitle">사용 불가 펜라이트・링라이트</h3>
          <ul className="notice-list">
            <li>배터리식·비배터리식 구분 없이 25cm 이상인 것.</li>
            <li>버튼 전지를 제외한 모든 전원을 사용하는 배터리식(25cm 미만 포함)인 것.</li>
            <li>
              시판 시 형태나 성능을 개조하여 밝기를 극단적으로 높이거나 점멸시키거나 여러
              개를 결합한 것.
            </li>
            <li>시판 제품이 아닌 부품을 조립하여 자작한 것.</li>
            <li>
              <p>기타 스태프가 부적절하다고 판단한 것.</p>
              <p className="info-note">
                ※ 공식 굿즈 펜라이트·링라이트는 사전 조정되어 위 제한에 포함되지
                않습니다.
              </p>
              <p className="info-note">
                ※ 또한 과거 하츠네 미쿠 공식 라이브 이벤트에서 공식 판매된 펜라이트는
                위 제한에 포함되지 않으며 사용 가능합니다.
              </p>
            </li>
          </ul>
        </div>
      </section>

      <section id="photo" className="container notice-section">
        <div className="notice-box info-box">
          <h2 className="section-title">촬영</h2>

          <h3 className="info-subtitle">촬영 안내</h3>
          <ul className="notice-list">
            <li>라이브 공연장 내에서의 촬영·녹음은 금지됩니다(공연 전·후 포함).</li>
            <li>
              기획전은 기본적으로 촬영 가능하지만, 일부 콘텐츠에 따라 촬영·녹음이
              금지될 수 있습니다. 촬영·녹음 금지 표시나 스태프의 지시에 따라
              주십시오.
            </li>
            <li>스캐너 등(스캐너 앱 포함)을 이용한 촬영은 금지됩니다.</li>
            <li>
              <p>
                셀카봉, 짐벌, 모노포드, 삼각대, 사다리 등 장비 사용은 금지됩니다(촬영
                이외 용도로 사용하는 경우 포함). 또한, 망원 렌즈 등 대형 장비의
                반입도 불가합니다.
              </p>
              <p className="info-note">※ 일부 등록 취재 매체를 제외</p>
            </li>
            <li>이동 중 촬영은 위험하므로 삼가해 주십시오.</li>
            <li>
              출입 금지 구역(파티션·패널 등으로 구분된 구역)에 카메라 등을 삽입하는
              행위는 위험하므로 삼가해 주십시오.
            </li>
            <li>
              <p>실시간 방송(라이브 스트리밍·생중계)은 금지됩니다.</p>
              <p className="info-note">※ 일부 등록 취재 매체를 제외</p>
            </li>
            <li>
              특정 인물을 촬영하거나 촬영한 사진·영상을 게시·게재할 경우 사전에
              본인의 허가를 받아 주십시오.
            </li>
            <li>불법 촬영은 엄격히 금지합니다.</li>
            <li>
              본 이벤트 출전·협력사 이외의 법인·개인 사업자가 자사 홍보를 위해
              촬영·공개하는 행위는 삼가해 주십시오.
            </li>
            <li>
              <a
                href="https://magicalmirai.com/2025/info_guidelines.html"
                className="notice-link"
              >
                응원 규칙
              </a>
              도 함께 확인해 주십시오.
            </li>
          </ul>
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
