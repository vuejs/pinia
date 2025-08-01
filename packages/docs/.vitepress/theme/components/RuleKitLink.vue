<script setup lang="ts">
import { useData } from 'vitepress'

const { site } = useData()

const translations = {
  'en-US': 'Vibe code Vue apps with confidence',
  'zh-CN': '自信地编写 Vue 应用的 Vibe 代码',
}
</script>

<template>
  <div class="rulekit">
    <a
      href="https://rulekit.dev?from=pinia"
      target="_blank"
      rel="sponsored noopener"
      aria-label="Visit RuleKit - curated rules for Cursor, Claude Code, and more (opens in new tab)"
      class="rulekit-link"
    >
      <div class="rulekit-content">
        <div class="rulekit-left">
          <span class="rulekit-sparkles" aria-hidden="true">✨</span>
          <span class="rulekit-text">
            <slot>{{ translations[site.lang] || translations['en-US'] }}</slot>
          </span>
        </div>
        <div class="rulekit-right">
          <svg
            width="1024"
            height="1024"
            viewBox="0 0 1024 1024"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            alt="RuleKit logo"
            class="rulekit-logo"
          >
            <path
              d="M335 694L353.947 697.225V737L335 733.775V694Z"
              fill="currentColor"
            />
            <path
              d="M355 538.234V673L335 669.766V536.078L355 538.234Z"
              fill="currentColor"
            />
            <path
              d="M259.255 329.5L313.424 338.585V414.78L374.576 425.512V350.39L422.5 359.457L422.529 391.816L399.251 388.374V443.756L375.649 440.537V460.314L313.424 449.576V430.878L287.675 426.585L286.602 367.561L259.255 364V329.5Z"
              fill="currentColor"
            />
            <path
              d="M398.897 113.5L647.031 158.597V199L676.034 205.5V276L836.085 304.623L896.239 362.605V498.968L873.681 516.147V778.5L914.5 792.095L755.522 914.5L180.84 802.832L130.354 738.409V472.125L103.5 457.092V336.835L164.728 270.264L291.48 205.5L321.557 211V176.85L350.56 165.5V139L398.897 113.5ZM379.562 148.933V184L350.56 182.218L349.485 259.527L379.562 263.822V184L582.581 218.725V300.328L622.325 307V224.094L598.693 220.873V188.661L379.562 148.933ZM433.271 218.725V234.831L561.097 257.379V240.2L433.271 218.725ZM291.48 234.831L223.807 272.412L740.484 364.752L802.786 325.024L673.885 302.476L622.325 330L561.097 319V282L433.271 259.527L389.23 285.296L321.557 275V240.2L291.48 234.831ZM180.84 288.517L128.206 343.277V440.537L233.475 461.387L232.401 360.457L259.255 364V446L284.103 449.576V476.42L311.889 480.714V750L373.117 762L374.191 691.165V493.599L399.251 497V472.125L422.5 476.42L422.529 391.816L449.383 396.964V500L543.911 516V414.143L571.839 418.438V388.374L624.474 396.964V423.807L652.402 428V534.5L778.08 551.5V443.756L731 392.244L180.84 288.517ZM831.789 336.835L757.671 383.005L796.341 423.807L871.533 374.416L831.789 336.835ZM807.083 445.281V529.032L871.533 486.083V404.48L807.083 445.281ZM571.839 449.576V521.516L587 524.5V592L606.213 595.603V527.5L624.474 531V458.5L571.839 449.576ZM155.06 472.125V729.5L191.5 778.5L713 880.5L754.448 853.298V579.497L635.215 560.17V601L682.479 609.562V649.29L663.144 647V682.575L682.479 684.723L683.5 814.5L652.402 808.201V839L543.911 819.5V788.874L511.685 783.505V654.5L532.095 658.5V623.52L511.685 620.299V578.424L557.875 585.94V545.138L422.5 521.516L402.12 538.234V654.658V766.326L373.117 762V791.021L311.889 778.5V750L285.035 744.851V512.926L264.5 493.599L155.06 472.125ZM778.08 579.497L780.228 833.971L847.901 781.358V538.234L778.08 579.497ZM561.097 627.5V664.5L543.911 661V788.874L565.394 793.169L567 669L584.729 672V632.5L561.097 627.5ZM611.583 639.626V676.5L628.77 679V802.832L652.402 808.201V682.575L635.215 680.428V643L611.583 639.626Z"
              fill="currentColor"
            />
          </svg>
          <span class="rulekit-title">RuleKit</span>
        </div>
      </div>
    </a>
  </div>
</template>

<style scoped>
.rulekit {
  margin: 1rem 0;
}

.rulekit-title {
  font-family:
    'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    'Liberation Mono', 'Courier New', monospace;
}

.rulekit-link {
  display: block;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 1px solid #dee2e6;
  text-decoration: none;
  color: #212529;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
}

.rulekit-link:visited {
  color: #212529;
}

.rulekit-link:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

.rulekit-link:focus:not(:focus-visible) {
  outline: none;
}

.rulekit-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  transition: left 0.6s ease;
}

.rulekit-link:hover::before {
  left: 100%;
}

.rulekit-link:hover {
  text-decoration: none !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  background: linear-gradient(135deg, #f1f3f4 0%, #e2e6ea 100%);
}

.rulekit-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  position: relative;
  z-index: 2;
}

.rulekit-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.rulekit-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rulekit-sparkles {
  font-size: 1.5rem;
}

.rulekit-logo {
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
  color: #495057;
}

.rulekit-text {
  font-weight: 500;
  font-family:
    'Spectral', ui-serif, system-ui, sans-serif, 'Apple Color Emoji',
    'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  font-size: 0.95rem;
  line-height: 1.4;
}

/* Dark mode styles */
.dark .rulekit-link {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border-color: #404040;
  color: #e5e5e5;
}

.dark .rulekit-link::before {
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.15),
    transparent
  );
}

.dark .rulekit-link:hover {
  text-decoration: none !important;
  background: linear-gradient(135deg, #262626 0%, #363636 100%);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.dark .rulekit-logo {
  color: #ffffff;
}

.dark .rulekit-text {
  color: #e5e5e5;
}

.dark .rulekit-link:visited {
  color: #e5e5e5;
}

.dark .rulekit-link:focus {
  outline-color: #66b3ff;
}
</style>
