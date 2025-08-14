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
        <div className="notice-box info-box">
          <p className="notice-caution">반드시 읽어 주세요</p>
          <h2 className="section-title">
            라이브 티켓의<span>‘본인 확인’ 실시에 대하여</span>
          </h2>
          <details open>
            <summary className="info-subtitle cursor-pointer">외국인표</summary>
            <section>
              <p className="text-left">
                모든 회장에서 라이브 입장 시 입장 시 무작위로 ‘본인 확인’을 실시합니다.<br />
                티켓 구매 시 개인정보를 등록해야 하며,<br />
                티켓을 여러 장 구매하시는 경우 동행자의 개인정보도 함께 등록하셔야 합니다.<br />
                티켓 신청 및 공연장 방문 전 반드시 확인해 주시기 바랍니다.
              </p>
              <p className="text-left">
                ‘본인 확인’은 신분증과 티켓에 기재된 이름을 대조하여 진행합니다.<br />
                공연 당일에 본인 확인이 이루어지지 않을 경우 입장이 거절될 수 있습니다.
              </p>
              <p className="info-note br_t_s">
                *본인 확인에 사용되는 ‘신분증’은 아래와 같습니다.
              </p>
            </section>
            <section>
              <h3 className="info-subtitle">신분증 안내</h3>
              <h3 className="passport">◆ 여권</h3>
              <p className="info-note">*사본 및 사진은 인정되지 않습니다.<br />
                *숙박 패키지 옵션을 구매하신 분은 패키지 안내를 반드시 확인해 주시기 바랍니다.
              </p>
              <p className="info-note">

              </p>
              <h3 className="info-subtitle">입장 안내</h3>
              <p className="text-left">
                공연장 방문 전 티켓이 반드시 발권되었는지 확인해 주시기 바랍니다.
              </p>
              <p className="info-note br_t_s">
                *티켓 발권 방법은 신청 결과 안내 이메일을 참고해 주십시오.<br />
                *공연장 인근 발권 가능 매장이 혼잡할 수 있으니 시간에 여유를 두고 방문하시기 바랍니다.<br /><br />
              </p>
              <p className="text-left">
                두 장 이상의 티켓을 구매하신 분은 구매자와 동행자 모두 함께 방문해 주시기 바랍니다.<br />
                지정된 ‘신분증’을 반드시 지참해 주시고,<br />
                시간에 여유를 두고 오시기 바랍니다.
              </p>
            </section>
            <section>
              <h3 className="info-subtitle">신분증 안내</h3>
              <p className="text-left">
                <i className="ico_mail i_l" />
                <img
                  src="images/images/mail_linkst.svg"
                  className="inquiry_mail"
                  alt=""
                  loading="lazy"
                />
                <a
                  href="mailto:event@linkst.jp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="notice-link"
                >
                  event@linkst.jp
                </a>
                <span> (영어 문의만)</span>
              </p>
              <p className="info-note">
                *티켓 문의 답변까지 다소 시간이 소요될 수 있습니다. <br />
                *공연 내용에 관한 문의는 자제해 주십시오.
              </p>
            </section>
          </details>
          <details>
            <summary className="info-subtitle cursor-pointer">내국인표</summary>
            <p>
              모든 회장에서 라이브 입장 시 무작위로 ‘본인 확인’을 실시합니다.
              <br />티켓 구매 시 개인정보를 등록해야 하며, 티켓을 여러 장 구매하시는
              경우 동행자의 개인정보도 함께 등록하셔야 합니다.<br />여러분의 양해와
              이해 부탁드립니다.
            </p>
            <p className="br_t_s">
              ‘본인 확인’은 신분증과 티켓에 기재된 이름을 대조하여 진행합니다.
              <br />공연 당일에 본인 확인이 이루어지지 않을 경우 입장이 거절될 수
              있습니다.<br />이 경우 티켓 요금 및 구매 수수료 등은 환불되지 않으니
              미리 양해해 주시기 바랍니다.
            </p>
            <ul className="notice-list br_t_s">
              <li>본인 확인에 사용되는 ‘신분증’은 아래와 같습니다.</li>
              <li>
                U-18석을 구매하신 분은 입장 시 학생증·보험증 또는 연령 확인이
                가능한 서류를 제시해 주시기 바랍니다. 해당 확인은 무작위로
                진행되지 않습니다.
              </li>
            </ul>

            <h3 className="info-subtitle br_t">‘신분증’에 대하여</h3>
            <p>사본이나 이미지(사진)는 무효 처리되니 유의해 주시기 바랍니다.</p>
            <p className="info-limit-title br_t">
              【사진 있는 신분증 (1종류만으로 가능)】
            </p>
            <div className="br_t_ss">
              <ul className="info-list">
                <li>운전면허증</li>
                <li>사진 부착 면허증</li>
                <li>여권</li>
                <li>마이넘버 카드</li>
                <li>주민 기본 대장 카드</li>
                <li>신체장애인 수첩</li>
                <li>정신장애인 보건복지 수첩</li>
                <li>치료 수첩</li>
                <li>재류 카드</li>
                <li>외국인 등록 증명서</li>
                <li>특별 영주자 증명서</li>
                <li>
                  <p>사원증·학생증·생도 수첩</p>
                  <p className="info-note">
                    (※사진 없는 경우 아래 항목과 함께 2종류 필요)
                  </p>
                </li>
              </ul>
              <ul className="info-list br_t_ss">
                <li>
                  위의 신분증 이외에 성명, 현주소, 생년월일이 확인 가능한 공적 증명서
                </li>
              </ul>
            </div>
            <p className="info-limit-title br_t_s">
              【사진 없는 신분증 (2종류)】
            </p>
            <div className="br_t_ss">
              <ul className="info-list">
                <li>건강보험 피보험자증</li>
                <li>의료비 수급자 자격증</li>
                <li>요양보험증</li>
                <li>생활보호 수급자증</li>
                <li>주민등록 등본</li>
                <li>호적 등본</li>
                <li>호적 초본</li>
                <li>인감 등록 증명서</li>
                <li>연금 수첩</li>
                <li>마이넘버 통지 카드</li>
              </ul>
              <ul className="info-list br_t_ss">
                <li>
                  위의 신분증 이외에 성명, 현주소, 생년월일이 확인 가능한 공적 증명서
                </li>
              </ul>
            </div>
            <ul className="notice-list br_t_s">
              <li>
                초등학생 이하 고객 중 사진 있는 신분증이 없는 경우,
                <strong>건강보험증</strong> 1종류로 확인합니다.
              </li>
              <li>
                숙박 플랜 옵션 티켓을 구매하신 분은 숙박 플랜 안내를 확인해 주시기
                바랍니다.
              </li>
            </ul>

            <h3 className="info-subtitle br_t">
              분배에 대하여 (티켓 2매 이상 구매하신 분)
            </h3>
            <p>
              ‘본인 확인’은 티켓 구매자와 동행자 모두 대상으로 무작위로 실시됩니다.
              <br />티켓을 2매 이상 구매하신 경우 동행자에게 티켓을 분배해야 합니다.
              <br />반드시 회장 방문 전에 티켓 분배를 완료해 주십시오.
              <br />티켓 분배 및 발권 방법은 구매하신 예매처의 안내를 확인해 주시기
              바랍니다.
            </p>
            <ul className="info-list bar br_t_s" style={{ marginBottom: '1em' }}>
              <li>
                <p className="txt_em">티켓피아</p>
                <p className="inline-block px-2 border border-white">분배 방법</p>
                <p>
                  【전자 티켓】【종이 티켓】
                  <span>
                    <a
                      href="https://t.pia.jp/guide/share.jsp"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="notice-link"
                    >
                      https://t.pia.jp/guide/share.jsp
                    </a>
                  </span>
                </p>
                <p className="inline-block px-2 border border-white">문의</p>
                <p>
                  <a
                    href="https://t.pia.jp/help/index.jsp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="notice-link"
                  >
                    https://t.pia.jp/help/index.jsp
                  </a>
                </p>
              </li>
              <li className="br_t_s">
                <p className="txt_em">로손 티켓</p>
                <p className="inline-block px-2 border border-white">분배 방법</p>
                <p>
                  【전자 티켓】
                  <span>
                    <a
                      href="https://l-tike.com/guide/share.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="notice-link"
                    >
                      https://l-tike.com/guide/share.html
                    </a>
                  </span>
                </p>
                <p className="inline-block px-2 border border-white">문의</p>
                <p>
                  <a
                    href="https://faq.l-tike.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="notice-link"
                  >
                    https://faq.l-tike.com/
                  </a>
                </p>
              </li>
              <li className="br_t_s">
                <p className="txt_em">e+</p>
                <p className="inline-block px-2 border border-white">분배 방법</p>
                <p>
                  【전자 티켓】
                  <span>
                    <a
                      href="https://eplus.jp/sf/guide/friends"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="notice-link"
                    >
                      https://eplus.jp/sf/guide/friends
                    </a>
                  </span>
                </p>
                <p className="inline-block px-2 border border-white">문의</p>
                <p>
                  <a
                    href="https://eplus.jp/qa/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="notice-link"
                  >
                    https://eplus.jp/qa/
                  </a>
                </p>
              </li>
            </ul>
          </details>
        </div>
      </section>

      <section id="common" className="container notice-section">
        <div className="notice-box info-box">
          <h2 className="section-title">공통 항목</h2>
          <h3 className="info-subtitle">기본 사항</h3>
          <ul className="notice-list">
            <li>
              라이브 입장에는 “라이브 티켓”, 기획전 입장에는 “기획전 티켓”이 필요합니다.
              “라이브 티켓”으로 기획전에 입장하거나, “기획전 티켓”으로 라이브에 입장할
              수 없습니다.
            </li>
            <li>
              고객 사정에 의한 환불은 불가하니 양해해 주시기 바랍니다. 기상 등 불가항력
              사유로 공연이나 이벤트가 취소될 경우 환불 안내를 드릴 수 있습니다.
            </li>
            <li>회장까지의 교통비·숙박비는 각자 부담입니다.</li>
            <li>사정에 따라 중지, 연기, 일부 내용 또는 장소가 변경될 수 있습니다.</li>
            <li>
              회장 내·외부 공간은 본 이벤트 개최를 위해 대여된 것이므로, 고객 자체
              기획 시행이나 홍보는 삼가해 주십시오. 또한 회장 주변(부지 외) 및 인접
              역까지의 경로는 통행에 방해되지 않도록 관리하고 있으니 협조 부탁드립니다.
            </li>
            <li>
              사고·혼란 방지 및 원활한 운영을 위해 스태프 지시사항과 주의사항을 반드시
              준수해 주십시오. 미준수 시 입장 거부, 퇴장 조치, 이벤트 중단 등이 있을 수
              있으며, 이 경우 환불되지 않으니 양해해 주십시오.
            </li>
            <li>
              회장 내외에서 뛰지 마시고, 줄 서기나 입·퇴장 시에는 걸어서 차례대로
              이동해 주십시오.
            </li>
            <li>
              줄에서 물건으로 자리 차지나 새치기는 금지됩니다. 부득이 화장실 이용 등으로
              줄을 벗어날 경우 주변에 알려 주십시오.
            </li>
            <li>
              어린 자녀를 동반하실 때는 떨어지지 않도록 주의해 주십시오. 회장 내에서는
              방송을 통한 개인 호출이 불가합니다.
            </li>
            <li>컨디션 불량 시에는 회장으로 오시기 전 의료기관을 방문해 주십시오.</li>
            <li>
              건강 관리에 유의하시고, 회장 내에서 이상을 느끼면 즉시 주변 스태프에게
              알려 주십시오.
            </li>
            <li>귀중품을 포함한 소지품은 본인 스스로 관리해 주십시오.</li>
            <li>
              이벤트 중 절도, 분실, 부상, 체조 불량 등 문제가 발생하면 즉시 회장 내
              스태프에게 알려 주십시오.
            </li>
            <li>분실물을 발견한 경우 즉시 회장 종합 안내소에 제출해 주십시오.</li>
            <li>
              예상치 못한 사고로 이어질 수 있으니 이동 중 스마트폰 사용(걷는 중 스크린
              조작 등)은 삼가해 주십시오.
            </li>
            <li>주변 관객에게 불편을 줄 수 있는 대형 수하물 반입은 삼가해 주십시오.</li>
            <li>
              회장 내 음주는 금지되며, 음주 후 입장도 불가합니다. 음식물·흡연은 지정된
              장소에서만 가능하며, 수분 섭취는 문제 없습니다.
            </li>
            <li>흡연 장소 이용 현황은 개최 시설 공식 웹사이트 등을 참고해 주십시오.</li>
            <li>회장 내에서 지정된 좌석 이외 장소에 앉는 행위는 삼가해 주십시오.</li>
            <li>장시간 공간 점유 및 수하물 펼치기는 삼가해 주십시오.</li>
            <li>회장 부지 외에서 설문조사나 영업 활동은 공식 기획이 아니므로 주의해 주십시오.</li>
            <li>회장 부지 외에서 무허가 판매품이나 리셀 제품을 구매하지 않도록 주의해 주십시오.</li>
            <li>전시물, 게시물 반출은 금지됩니다.</li>
            <li>생파(생대파)의 반입은 삼가해 주십시오.</li>
            <li>
              개인·법인 구분 없이 출연자에게 선물·증정물을 전달할 수 없습니다. 사전 양해
              후 반입을 자제해 주십시오.
            </li>
            <li>
              개인·법인 구분 없이 회장 내 출전사, 출연자, 관계자에 대한 영업·권유 행위는
              삼가해 주십시오.
            </li>
            <li>
              각 회장에서는 기록 사진·영상 촬영, 미디어 취재가 진행됩니다. 참가자가 촬영에
              포함될 수 있으니 양해해 주십시오.
            </li>
            <li>참가자 간 분쟁에 대해서는 책임지지 않으니 당사자 간 협의해 주십시오.</li>
            <li>사정에 따라 중지, 연기, 일부 내용 또는 장소가 변경될 수 있습니다.</li>
            <li>본 웹사이트의 이미지·영상 복제, 전용, 배포 등의 행위를 금지합니다.</li>
            <li>
              예상치 못한 혼란 및 트러블 방지를 위해 이벤트 당일 같은 시설 내에서 본 이벤트
              및 ‘하츠네 미쿠’ 관련 팬 이벤트(집회·기획 등 포함)를 실시하지 말아 주십시오.
            </li>
            <li>회장 시설 문의는 삼가해 주십시오.</li>
            <li>
              본 ‘주의사항’에 기재된 내용을 이벤트 규칙으로 합니다. 기재되지 않은 행위가
              직원에게 부적절하다고 판단될 경우 주의를 드릴 수 있으니 양해해 주십시오.
            </li>
            <li>
              참여 전 ‘하츠네 미쿠 「매지컬 미라이 2025」’ 공식 웹사이트를 확인해
              주십시오.
              <br />
              <a href="../2025/" className="notice-link">
                https://magicalmirai.com/2025/
              </a>
            </li>
          </ul>

          <p className="info-location text-left">SENDAI</p>
          <p className="text-left">
            AER：개최일 오전 8:00 이전에 줄 서는 것은 삼가해 주십시오.
          </p>
          <p className="text-left">
            센다이역 앞 이비언즈 9F·10F, 이벤트홀 쇼에이, 센다이 선플라자 호텔, 센다이
            선플라자 홀：개최일 오전 9:00 이전에 줄 서는 것은 삼가해 주십시오.
          </p>
          <ul className="info-list kome br_t_s text-left">
            <li>
              센다이역 앞 이비언즈 2F·3F·4F·5F：오전 10:00 이전에 줄 서는 것은
              삼가해 주십시오.
            </li>
            <li>각 회장의 직원 안내·유도에 따라 주십시오.</li>
          </ul>

          <p className="info-location text-left">TOKYO</p>
          <p className="text-left">개최일 오전 6:00 이전에 줄 서는 것은 삼가해 주십시오.</p>

          <p className="info-location text-left">OSAKA</p>
          <p className="text-left">개최일 오전 7:00 이전에 줄 서는 것은 삼가해 주십시오.</p>

          <h3 className="info-subtitle">휠체어로 오시는 분 안내</h3>
          <p className="text-left">
            휠체어 이용 고객은 휠체어 전용 공간으로 안내해 드립니다(동반자분도 티켓이
            필요합니다). 관람 공간 확보를 위해 티켓 구매 후 공연 1주일 전까지 아래로
            연락해 주십시오.
          </p>
          <p className="info-location text-left">SENDAI 회장</p>
          <p className="text-left">GIP</p>
          <p className="text-left">
            <a
              href="https://www.gip-web.co.jp/t/info"
              target="_blank"
              className="notice-link"
            >
              https://www.gip-web.co.jp/t/info<i className="icon_link" />
            </a>
            <span>（평일 10:00～18:30 대응）</span>
          </p>
          <p className="text-left">
            <a
              href="https://www.gip-web.co.jp/"
              target="_blank"
              className="notice-link"
            >
              GIP 공식 웹사이트<i className="icon_link" />
            </a>
          </p>
          <p className="info-location text-left">OSAKA 회장</p>
          <p className="txts_s text-left">YUMEBANCHI</p>
          <p className="text-left">
            <i className="icon_phone i_l" /> 06-6341-3525
            <span>（평일 12:00～17:00, 토일·공휴일 휴무）</span>
          </p>
          <p className="kome text-left">※ 문의 대응 시간이 단축될 수 있습니다.</p>
          <p className="text-left">
            <a
              href="https://www.yumebanchi.jp/"
              target="_blank"
              className="notice-link"
            >
              YUMEBANCHI 공식 웹사이트<i className="icon_link" />
            </a>
          </p>
          <p className="info-location text-left">TOKYO 회장</p>
          <p className="txts_s text-left">SOGO TOKYO</p>
          <p className="text-left">
            <i className="icon_phone i_l" /> 03-3405-9999
            <span>（운영 시간：월～토 12:00～13:00／16:00～19:00 ※일·공휴일 제외）</span>
          </p>
          <p className="text-left">
            <a
              href="https://sogotokyo.com/"
              target="_blank"
              className="notice-link"
            >
              SOGO TOKYO 공식 웹사이트<i className="icon_link" />
            </a>
          </p>
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
                SENDAI 기획전은 여러 장소에서 개최되며, 유료 구역과 무료 구역으로
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
              <br />
              <p className="inline-block px-2 border border-white">기획전 티켓 확인소</p>
              <p className="br_t_ss">AER 2F 아트리움</p>
              <ul className="info-list">
                <li>8월 1일(금), 8월 2일(토) <span>9:00~19:00</span></li>
                <li>8월 3일(일) <span>9:00~18:00</span></li>
              </ul>
              <p className="br_t_ss">仙台駅前イービーンズ 2F</p>
              <ul className="info-list">
                <li>8월 1일(금), 8월 2일(토) <span>13:00~19:00</span></li>
                <li>8월 3일(일) <span>13:00~18:00</span></li>
              </ul>
              <p className="br_t_ss">仙台サンプラザホール</p>
              <ul className="info-list">
                <li>8월 1일(금)~8월 3일(일) <span>13:00~18:00</span></li>
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
              8월 11일 (<span className="week-sun">월·공휴일</span>){' '}
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
            <li>매지컬 미라이 2025 핫피 메인 비주얼 ver.</li>
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
        <div className="notice-box info-box">
          <h2 className="section-title">코스프레</h2>

          <p className="info-location">SENDAI (센다이역 앞 이빈즈)</p>
          <h3 className="info-subtitle">코스프레 탈의실</h3>
          <ul className="info-list">
            <li>
              8월 1일 (금) <span>10:00~19:00</span>
            </li>
            <li>
              8월 2일 (<span className="week-sat">토</span>) <span>10:00~19:00</span>
            </li>
            <li>
              8월 3일 (<span className="week-sun">일</span>) <span>10:00~18:00</span>
            </li>
          </ul>
          <ul className="notice-list br_t_s">
            <li>
              코스프레 의상, 코스프레용 가발을 착용한 채로의 입장은 금지됩니다. 규정을
              준수하지 않을 경우 티켓 소지 여부와 관계없이 입장이 거부될 수 있으니
              주의해 주십시오.
            </li>
            <li>
              코스프레가 가능한 장소는 센다이역 앞 이빈즈 내 코스프레 이동 가능 구역에
              한정됩니다. 명시되지 않은 장소나 다른 회장에서의 코스프레는 삼가 주십시오.
            </li>
            <li>
              ＜센다이역 앞 이빈즈 내 코스프레 안내＞
              <ul className="info-sublist">
                <li>
                  코스프레 복장으로 이동할 수 있는 구역은 3F~10F(4F ‘모리의 가든 테라스’
                  제외)에 한정됩니다.
                </li>
                <li>
                  코스프레 복장으로 촬영할 수 있는 장소는 9F·10F ‘마지컬 미라이 2025’ 회장
                  내에 한정됩니다. 그 외 통로 및 매장 등에서의 촬영은 금지됩니다. 단, 4F
                  ‘프리치치’ 내 프린트 씰 기계에서의 촬영은 예외적으로 가능합니다.
                </li>
                <li>
                  3F ‘겐키도 정골원’, ‘Hair by PROVE’, ‘소라〜추〜’ 세 점포는 코스프레
                  복장으로 입장할 수 없습니다.
                </li>
                <li>
                  코스프레 의상 및 가발을 착용한 채로의 퇴관, 코스프레 가능 구역 외 이동은
                  금지됩니다.
                </li>
              </ul>
            </li>
            <li>코스프레 의상 및 가발을 착용한 채로 라이브에 참여하는 것은 금지됩니다.</li>
            <li>공공 시설 및 회장 내 화장실에서의 갈아입기는 삼가 주십시오.</li>
            <li>
              탈의실은 기획전 회장 내에 설치되나, 공간이 한정되어 있으니 미리 양해 바랍니다.
              코스프레 등록비·탈의실 사용료·카메라 등록비 등은 모두 무료입니다.
            </li>
            <li>
              탈의실 이용자 전용 입장구는 없으므로 다른 방문객과 동일하게 기획전 입장구 앞에
              줄을 서 주십시오.
            </li>
            <li>
              탈의실이 야외에 설치되어 있어 우천·악천 시에는 폐장될 수 있으니 양해 바랍니다.
            </li>
            <li>다른 사람에게 폐나 불쾌감을 주는 의상이나 행동은 일체 금지합니다.</li>
            <li>
              코스프레는 본인 책임 하에 진행해 주십시오. 코스프레 내용·종류로 인한 사고·문제에
              대해 주최 측 및 회장 측은 책임을 지지 않습니다.
            </li>
            <li>
              얼굴이 완전히 가려져 시야가 극도로 나빠지는 의상(풀 마스크, 가면, 헬멧, 머리
              장식 등)은 금지됩니다.
            </li>
            <li>
              타인에게 상해를 입힐 수 있는 아이템(금속제 긴 장비 등)의 반입은 금지됩니다.
            </li>
            <li>
              노출이 심해 공공음란에 해당할 수 있는 의상(성기나 속옷이 보이거나 비치는 것)은
              금지됩니다.
            </li>
            <li>장시간 촬영이나 주변에 불편을 주는 촬영은 삼가 주십시오.</li>
            <li>
              촬영 시에는 촬영자와 촬영 대상자가 반드시 상호 확인 후 진행해 주시기 바랍니다.
            </li>
            <li>
              회장 내(센다이역 앞 이빈즈)에는 펀 팬 에어리어를 마련하고 있으니, 혼잡 시 이용해
              주십시오.
            </li>
            <li>
              펀 팬 에어리어는 준비 및 청소 등으로 인해 이용할 수 없는 시간이 발생할 수 있으니
              양해 바랍니다.
            </li>
            <li>
              규칙이 지켜지지 않는다고 판단될 경우 코스프레 금지나 강제 퇴장 등의 조치를 취할
              수 있습니다.
            </li>
            <li>
              기획전 회장 폐장 시 모든 고객이 퇴장할 수 있도록 협조 부탁드립니다.
            </li>
          </ul>

          <hr className="section-divider" />

          <p className="info-location">OSAKA</p>
          <h3 className="info-subtitle">코스프레 탈의실</h3>
          <ul className="info-list">
            <li>
              8월 9일 (<span className="week-sat">토</span>) <span>9:00~17:30</span>
            </li>
            <li>
              8월 10일 (<span className="week-sun">일</span>) <span>9:00~17:30</span>
            </li>
            <li>
              8월 11일 (<span className="week-sun">월·공휴일</span>) <span>9:00~17:30</span>
            </li>
          </ul>
          <ul className="notice-list br_t_s">
            <li>
              코스프레 의상, 코스프레용 가발을 착용한 채로의 입장은 금지됩니다. 규정을
              준수하지 않을 경우 티켓 소지 여부와 관계없이 입장이 거부될 수 있으니
              주의해 주십시오.
            </li>
            <li>
              코스프레가 가능한 장소는 인텍스 오사카 3호관 기획전 회장 내에 한정됩니다.
              코스프레 복장으로 기획전 회장 밖으로 퇴장하는 것은 금지됩니다.
            </li>
            <li>
              코스프레 복장으로 인텍스 오사카 4호관·5호관A에서 열리는 라이브·기획전에
              참여하는 것은 금지됩니다.
            </li>
            <li>공공 시설 및 회장 내 화장실에서의 갈아입기는 삼가 주십시오.</li>
            <li>
              탈의실은 기획전 회장 내에 설치되나, 공간이 한정되어 있으니 미리 양해 바랍니다.
              코스프레 등록비·탈의실 사용료·카메라 등록비 등은 모두 무료입니다.
            </li>
            <li>
              탈의실 이용자 전용 입장구는 없으므로 다른 방문객과 동일하게 기획전 입장구 앞에
              줄을 서 주십시오.
            </li>
            <li>다른 사람에게 폐나 불쾌감을 주는 의상이나 행동은 일체 금지합니다.</li>
            <li>
              코스프레는 본인 책임 하에 진행해 주십시오. 코스프레 내용·종류로 인한 사고·문제에
              대해 주최 측 및 회장 측은 책임을 지지 않습니다.
            </li>
            <li>
              얼굴이 완전히 가려져 시야가 극도로 나빠지는 의상(풀 마스크, 가면, 헬멧 등)은
              금지됩니다.
            </li>
            <li>
              타인에게 상해를 입힐 수 있는 아이템(금속제 긴 장비 등)의 반입은 금지됩니다.
            </li>
            <li>노출이 심해 공공음란에 해당할 수 있는 의상은 금지됩니다.</li>
            <li>장시간 촬영이나 주변에 불편을 주는 촬영은 삼가 주십시오.</li>
            <li>
              촬영 시에는 촬영자와 촬영 대상자가 반드시 상호 확인 후 진행해 주시기 바랍니다.
            </li>
            <li>회장 내에는 펀 팬 에어리어를 마련하고 있으니, 혼잡 시 이용해 주십시오.</li>
            <li>
              펀 팬 에어리어는 줄 정리 및 청소 등의 이유로 이용할 수 없는 시간이 발생할 수
              있으니 양해 바랍니다.
            </li>
            <li>
              규칙이 지켜지지 않는다고 판단될 경우 코스프레 금지나 강제 퇴장 등의 조치를 취할
              수 있습니다.
            </li>
            <li>
              기획전 회장 폐장 시 모든 고객이 퇴장할 수 있도록 협조 부탁드립니다.
            </li>
          </ul>

          <hr className="section-divider" />

          <p className="info-location">TOKYO</p>
          <h3 className="info-subtitle">코스프레 탈의실</h3>
          <ul className="info-list">
            <li>
              8월 29일 (금) <span>9:00~17:30</span>
            </li>
            <li>
              8월 30일 (<span className="week-sat">토</span>) <span>9:00~17:30</span>
            </li>
            <li>
              8월 31일 (<span className="week-sun">일</span>) <span>9:00~17:30</span>
            </li>
          </ul>
          <ul className="notice-list br_t_s">
            <li>
              코스프레 의상, 코스프레용 가발을 착용한 채로의 입장은 금지됩니다. 규정을
              준수하지 않을 경우 티켓 소지 여부와 관계없이 입장이 거부될 수 있으니
              주의해 주십시오.
            </li>
            <li>
              코스프레가 가능한 장소는 기획전 회장(에스프라나도 포함)에 한정됩니다. 코스프레
              복장으로 기획전 회장 밖으로 퇴장하는 것은 금지됩니다.
            </li>
            <li>코스프레 복장으로 라이브에 참여하는 것은 금지됩니다.</li>
            <li>공공 시설 및 회장 내 화장실에서의 갈아입기는 삼가 주십시오.</li>
            <li>
              탈의실은 기획전 회장 내에 설치되나, 공간이 한정되어 있으니 미리 양해 바랍니다.
              코스프레 등록비·탈의실 사용료·카메라 등록비 등은 모두 무료입니다.
            </li>
            <li>
              탈의실 이용자 전용 입장구는 없으므로 다른 방문객과 동일하게 기획전 입장구 앞에
              줄을 서 주십시오.
            </li>
            <li>다른 사람에게 폐나 불쾌감을 주는 의상이나 행동은 일체 금지합니다.</li>
            <li>
              코스프레는 본인 책임 하에 진행해 주십시오. 코스프레 내용·종류로 인한 사고·문제에
              대해 주최 측 및 회장 측은 책임을 지지 않습니다.
            </li>
            <li>
              얼굴이 완전히 가려져 시야가 극도로 나빠지는 의상(풀 마스크, 가면, 헬멧 등)은
              금지됩니다.
            </li>
            <li>
              타인에게 상해를 입힐 수 있는 아이템(금속제 긴 장비 등)의 반입은 금지됩니다.
            </li>
            <li>노출이 심해 공공음란에 해당할 수 있는 의상은 금지됩니다.</li>
            <li>장시간 촬영이나 주변에 불편을 주는 촬영은 삼가 주십시오.</li>
            <li>
              촬영 시에는 촬영자와 촬영 대상자가 반드시 상호 확인 후 진행해 주시기 바랍니다.
            </li>
            <li>회장 내에는 펀 팬 에어리어를 마련하고 있으니, 혼잡 시 이용해 주십시오.</li>
            <li>
              펀 팬 에어리어는 11:00 이후에 에스프라나도(관내 통로/기획전 회장 일부)에
              설치됩니다.
            </li>
            <li>
              펀 팬 에어리어 이용에는 입장용 리스트 밴드(기획전 티켓)가 필요합니다.
            </li>
            <li>
              규칙이 지켜지지 않는다고 판단될 경우 코스프레 금지나 강제 퇴장 등의 조치를 취할
              수 있습니다.
            </li>
            <li>
              기획전 회장 폐장 시 모든 고객이 퇴장할 수 있도록 협조 부탁드립니다.
            </li>
          </ul>
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

          <h3 className="info-subtitle">입장·재입장 안내</h3>
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
              당일 준비 사정 등으로 개장·개연 시간이 변경될 경우 회장 내
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

          <h3 className="info-subtitle">대기·관람 안내</h3>
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
                특수 펜라이트(길이 25cm 이상, 발광량이 많은 것, 자작·개조된 것)나
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

          <h3 className="info-subtitle">사용 불가 펜라이트·링라이트</h3>
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
