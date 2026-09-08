'use client';

import Image from 'next/image';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { money, type StoreSettings } from '@/lib/catalog-data';
import { useCart } from '@/lib/cart';

export function CartSheet({ settings }: { settings: StoreSettings }) {
  const cart = useCart();
  return (
    <Sheet open={cart.open} onOpenChange={cart.setOpen}>
      <SheetContent className="cart-panel sm:max-w-[460px]">
        <SheetHeader className="cart-head">
          <SheetTitle>Seu carrinho</SheetTitle>
          <SheetDescription>
            {cart.count
              ? `${cart.count} item${cart.count > 1 ? 's' : ''} selecionado${cart.count > 1 ? 's' : ''}`
              : 'Pronto para receber suas escolhas.'}
          </SheetDescription>
        </SheetHeader>
        <div className="cart-items">
          {!cart.items.length ? (
            <div className="empty-cart">
              <ShoppingBag size={34} />
              <h3>Seu carrinho está vazio</h3>
              <p>Escolha um produto e monte seu pedido na medida certa.</p>
              <button onClick={() => cart.setOpen(false)}>
                Continuar comprando
              </button>
            </div>
          ) : (
            cart.items.map((item) => (
              <article className="cart-item" key={item.key}>
                <Image
                  src={item.product.imageUrl}
                  alt=""
                  width={78}
                  height={86}
                />
                <div>
                  <strong>{item.product.name}</strong>
                  <span>{item.variant.label}</span>
                  <b>{money(item.variant.priceCents * item.quantity)}</b>
                  <div className="quantity-control">
                    <button
                      onClick={() =>
                        cart.updateQuantity(item.key, item.quantity - 1)
                      }
                      aria-label="Diminuir quantidade"
                    >
                      <Minus size={14} />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        cart.updateQuantity(item.key, item.quantity + 1)
                      }
                      aria-label="Aumentar quantidade"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <button
                  className="remove-item"
                  onClick={() => cart.removeItem(item.key)}
                  aria-label={`Remover ${item.product.name}`}
                >
                  <Trash2 size={17} />
                </button>
              </article>
            ))
          )}
        </div>
        {!!cart.items.length && (
          <SheetFooter className="cart-footer">
            <div className="cart-total">
              <span>Total estimado</span>
              <strong>{money(cart.totalCents)}</strong>
            </div>
            <p>O valor e a disponibilidade serão confirmados no atendimento.</p>
            <button
              className="whatsapp-checkout"
              onClick={() => cart.checkout(settings)}
            >
              Finalizar pedido pelo WhatsApp
            </button>
            <button className="clear-cart" onClick={cart.clear}>
              Limpar carrinho
            </button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
