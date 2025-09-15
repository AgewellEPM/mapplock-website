import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { EducationComponent } from './education/education.component';
import { TradeshowComponent } from './tradeshow/tradeshow.component';
import { FeaturesComponent } from './features/features.component';
import { PricingComponent } from './pricing/pricing.component';
import { BlogComponent } from './blog/blog.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'education', component: EducationComponent },
  { path: 'tradeshow', component: TradeshowComponent },
  { path: 'features', component: FeaturesComponent },
  { path: 'pricing', component: PricingComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'success', component: CheckoutComponent },
  { path: '**', redirectTo: '' }
];
